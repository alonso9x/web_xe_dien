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

// HÀM KIỂM TRA ẢNH "SẠCH" ĐÃ ĐƯỢC NÂNG CẤP (Chống logo, icon, avatar tác giả)
function isValidImage(url: string | undefined, className: string = '', alt: string = ''): boolean {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  const lowerClass = className.toLowerCase();
  const lowerAlt = alt.toLowerCase();
  
  // Loại bỏ ảnh proxy của Google
  if (lowerUrl.includes('google.com') || lowerUrl.includes('proxy')) return false;
  
  // Loại bỏ các định dạng rác
  if (lowerUrl.includes('.svg') || lowerUrl.includes('.gif')) return false;
  
  // Danh sách đen từ khóa rác
  const blacklist = ['logo', 'icon', 'banner', 'avatar', 'author', 'tac-gia', 'thumb'];
  
  for (const word of blacklist) {
      // Nếu URL, Class hoặc Alt chứa từ khóa rác -> Loại ngay lập tức
      if (lowerUrl.includes(word) || lowerClass.includes(word) || lowerAlt.includes(word)) {
          return false;
      }
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

    // --- BỘ LỌC ẢNH THÔNG MINH MỚI (ƯU TIÊN ẢNH SỐ 2) ---
    let rawImageUrl = '';
    const validImages: string[] = [];
    
    // 1. Quét tất cả ảnh nằm TRONG khu vực nội dung bài viết trước
    const contentAreaSelectors = [
      'article img', 
      '.detail-content img', 
      '.article-content img', 
      '.post-content img', 
      '#main-detail img',
      '.cms-body img',
      '.content img'
    ];

    const joinedSelectors = contentAreaSelectors.join(', ');
    
    $(joinedSelectors).each((i: number, el: any) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      const className = $(el).attr('class') || '';
      const alt = $(el).attr('alt') || '';
      
      // Nếu là ảnh sạch và chưa có trong mảng thì đẩy vào
      if (isValidImage(src, className, alt) && !validImages.includes(src as string)) {
          validImages.push(src as string);
      }
    });

    // Lựa chọn ảnh ưu tiên: Lấy ảnh số 2, nếu không có thì lấy ảnh số 1
    if (validImages.length >= 2) {
        rawImageUrl = validImages[1]; 
        console.log(`✅ Bài có nhiều ảnh, đã chọn ảnh thứ 2: ${rawImageUrl}`);
    } else if (validImages.length === 1) {
        rawImageUrl = validImages[0];
        console.log(`✅ Bài chỉ có 1 ảnh sạch, đã chọn: ${rawImageUrl}`);
    }

    // 2. Nếu nội dung không có ảnh, vớt vát bằng ảnh meta (ảnh bìa lúc share Facebook)
    if (!rawImageUrl) {
        const ogImage = $('meta[property="og:image"]').attr('content') || $('meta[property="twitter:image"]').attr('content');
        if (isValidImage(ogImage)) {
            rawImageUrl = ogImage as string;
            console.log(`✅ Không có ảnh nội dung, dùng ảnh Cover/Meta: ${rawImageUrl}`);
        }
    }

    // 3. Nếu vẫn không có, tìm kiếm trên toàn trang nhưng PHẢI LỌC RẤT KỸ
    if (!rawImageUrl) {
      $('img').each((i: number, el: any) => {
        const src = $(el).attr('src') || $(el).attr('data-src');
        const className = $(el).attr('class') || '';
        const alt = $(el).attr('alt') || '';
        
        if (isValidImage(src, className, alt)) {
            rawImageUrl = src as string;
            console.log(`✅ Vớt vát ảnh toàn trang: ${rawImageUrl}`);
            return false; // Dừng vòng lặp each
        }
      });
    }

    if (!rawImageUrl) {
        console.warn("⚠️ Không tìm thấy ảnh nào hợp lệ (hoặc toàn logo/rác).");
    }

    await browser.close();

    // XỬ LÝ TẢI ẢNH BẰNG AXIOS (Giữ nguyên 100%)
    if (rawImageUrl) {
        try {
            const finalImageUrl = new URL(rawImageUrl, url).href;
            console.log(`📥 Đang tải ảnh về: ${finalImageUrl}`);

            const response = await axios.get(finalImageUrl, {
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Referer': url 
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
            
            return { content, imageUrl: `/images/news/${fileName}` };

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