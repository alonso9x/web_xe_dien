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

    // Chặn tài nguyên thừa
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

    // --- BỘ LỌC ẢNH THÔNG MINH (CHỐNG 404) ---
    let rawImageUrl = '';
    
    // Tìm tất cả ứng viên ảnh
    const candidates = [
        $('meta[property="og:image"]').attr('content'),
        $('meta[property="twitter:image"]').attr('content'),
        $('article img').first().attr('src'),
        $('img').first().attr('src')
    ];

    // Lọc bỏ những link ảnh nào chứa "google.com" (đây là nguyên nhân gây 404)
    for (const img of candidates) {
        if (img && !img.includes('google.com') && !img.includes('proxy')) {
            rawImageUrl = img;
            console.log("✅ Tìm thấy ảnh hợp lệ:", rawImageUrl);
            break;
        } else if (img) {
            console.log("⚠️ Bỏ qua ảnh proxy của Google:", img);
        }
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
            
            return { content, imageUrl: `/images/news/${fileName}` };

        } catch (err) {
            console.error("❌ Không tải được ảnh, nguyên nhân:", err);
            return { content, imageUrl: null };
        }
    } else {
        console.warn("⚠️ Không tìm thấy ảnh nào không phải của Google.");
    }

    return { content, imageUrl: null };
    
  } catch (error: any) {
    if (browser) await browser.close();
    console.error("❌ LỖI SCRAPER CHI TIẾT:", error?.message || error);
    return { error: "Lỗi kết nối." };
  }
}