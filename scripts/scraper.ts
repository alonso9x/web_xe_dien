import * as cheerio from 'cheerio';
import Parser from 'rss-parser';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as fs from 'fs';
import axios from 'axios';

puppeteer.use(StealthPlugin());
const parser = new Parser();

export async function getLatestNewsLinks(keyword: string) {
  try {
    const feed = await parser.parseURL(`https://news.google.com/rss/search?q=${encodeURIComponent(keyword)}&hl=vi&gl=VN&ceid=VN:vi`);
    if (feed.items && feed.items.length > 0) {
      return feed.items.slice(0, 5).map((item: any) => ({
        title: item.title,
        link: item.link
      }));
    }
    return null;
  } catch (error) {
    console.error("Lỗi RSS Parser:", error);
    return null;
  }
}

// HÀM KIỂM TRA ẢNH "SẠCH" (Chống logo, icon, ảnh rác)
function isValidImage(url: string | undefined): boolean {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  
  // Loại bỏ ảnh proxy của Google
  if (lowerUrl.includes('google.com') || lowerUrl.includes('proxy')) return false;
  
  // Loại bỏ các định dạng rác và các từ khóa nhận diện logo/ảnh quảng cáo
  if (lowerUrl.includes('.svg') || lowerUrl.includes('.gif')) return false;
  if (
      lowerUrl.includes('logo') || 
      lowerUrl.includes('icon') || 
      lowerUrl.includes('banner') || 
      lowerUrl.includes('avatar')
  ) {
      return false;
  }
  
  return true;
}

export async function fetchNewsContent(url: string) {
  let browser: any = null;
  try {
    console.log(`🔍 Đang mở trình duyệt để cào: ${url}`);
    
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        '--disable-dev-shm-usage',
        '--blink-settings=imagesEnabled=false'
      ]
    });
    
    const page = await browser.newPage();

    // Chặn tài nguyên thừa (tăng tốc độ cào)
    await page.setRequestInterception(true);
    page.on('request', (req: any) => {
      const type = req.resourceType();
      if (['stylesheet', 'font', 'media', 'image'].includes(type)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36');
    
    // Dùng networkidle0 để đợi trang load xong hết các redirect (chuyển hướng)
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 3000)); 

    const html = await page.content();
    const $ = cheerio.load(html);
    
    // Kiểm tra video
    if ($('video').length > 0 || $('iframe[src*="youtube"]').length > 0) {
      await browser.close();
      return { error: "Bài viết chứa video, tự động bỏ qua." };
    }

    // Lấy nội dung text
    let content = '';
    $('article p, .content p, .detail-content p, .detail-cmain p, .singular-content p, p').each((i: number, el: any) => {
      content += $(el).text().trim() + '\n\n';
    });

    // --- BỘ LỌC ẢNH THÔNG MINH MỚI (CHỐNG LOGO, CHỐNG RÁC) ---
    let rawImageUrl = '';
    
    // 1. Ưu tiên tìm ảnh nằm TRONG khu vực nội dung bài viết trước
    const contentAreaSelectors = [
      'article img', 
      '.detail-content img', 
      '.article-content img', 
      '.post-content img', 
      '#main-detail img',
      '.cms-body img',
      '.content img'
    ];

    for (const selector of contentAreaSelectors) {
      const imgEls = $(selector);
      for (let i = 0; i < imgEls.length; i++) {
        const src = $(imgEls[i]).attr('src') || $(imgEls[i]).attr('data-src');
        if (isValidImage(src)) {
          rawImageUrl = src as string;
          break;
        }
      }
      if (rawImageUrl) break;
    }

    // 2. Nếu nội dung không có ảnh, vớt vát bằng ảnh meta (ảnh bìa lúc share Facebook)
    if (!rawImageUrl) {
        const ogImage = $('meta[property="og:image"]').attr('content') || $('meta[property="twitter:image"]').attr('content');
        if (isValidImage(ogImage)) {
            rawImageUrl = ogImage as string;
        }
    }

    // 3. Nếu vẫn không có, tìm kiếm trên toàn trang nhưng PHẢI LỌC RẤT KỸ
    if (!rawImageUrl) {
      $('img').each((i: number, el: any) => {
        const src = $(el).attr('src') || $(el).attr('data-src');
        if (isValidImage(src)) {
            rawImageUrl = src as string;
            return false; // Dừng vòng lặp each
        }
      });
    }

    if (rawImageUrl) {
        console.log("✅ Tìm thấy ảnh hợp lệ:", rawImageUrl);
    } else {
        console.warn("⚠️ Không tìm thấy ảnh nào hợp lệ (hoặc toàn logo/rác).");
    }

    await browser.close();

    // XỬ LÝ TẢI ẢNH BẰNG AXIOS
    if (rawImageUrl) {
        try {
            const finalImageUrl = new URL(rawImageUrl, url).href;
            console.log(`📥 Đang tải ảnh về: ${finalImageUrl}`);

            const response = await axios.get(finalImageUrl, {
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Referer': url // Quan trọng: Báo cho server biết mình đến từ trang gốc
                },
                timeout: 15000
            });

            if (!fs.existsSync('public/images/news')) {
                fs.mkdirSync('public/images/news', { recursive: true });
            }

            const fileName = `img_${Date.now()}.jpg`;
            const filePath = `public/images/news/${fileName}`;
            
            fs.writeFileSync(filePath, Buffer.from(response.data, 'binary'));
            console.log(`💾 Đã lưu ảnh thành công: ${filePath}`);
            
            // SỬA LỖI CRASH FRONTEND Ở ĐÂY: Bỏ dấu "/" ở đầu
            return { content, imageUrl: `images/news/${fileName}` };

        } catch (err) {
            console.error("❌ Không tải được ảnh, nguyên nhân:", err);
            return { content, imageUrl: null };
        }
    }

    return { content, imageUrl: null };
    
  } catch (error: any) {
    if (browser) await browser.close();
    console.error("❌ LỖI SCRAPER CHI TIẾT:", error?.message || error);
    return { error: "Lỗi kết nối." };
  }
}