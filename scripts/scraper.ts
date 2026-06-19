import * as cheerio from 'cheerio';
import Parser from 'rss-parser';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as fs from 'fs';
import axios from 'axios'; // Bổ sung thư viện để tải ảnh độc lập

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
    return null;
  }
}

export async function fetchNewsContent(url: string) {
  let browser: any = null;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--blink-settings=imagesEnabled=false' // Tắt load ảnh trong trình duyệt để nhanh hơn
      ]
    });
    
    const page = await browser.newPage();

    // Chặn tài nguyên không cần thiết để tăng tốc
    await page.setRequestInterception(true);
    page.on('request', (req: any) => {
      const resourceType = req.resourceType();
      if (['stylesheet', 'font', 'media', 'image'].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 720 });

    // Truy cập link báo
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Đợi 3s để load nội dung text
    await new Promise(resolve => setTimeout(resolve, 3000)); 

    const html = await page.content();
    const $ = cheerio.load(html);
    
    if ($('video').length > 0 || $('iframe[src*="youtube"]').length > 0) {
      await browser.close();
      return { error: "Bài viết chứa video, tự động bỏ qua." };
    }

    let content = '';
    $('article p, .content p, .detail-content p, .detail-cmain p, .singular-content p, p').each((i: number, el: any) => {
      content += $(el).text().trim() + '\n\n';
    });

    // CẢI TIẾN: Ưu tiên lấy ảnh chuẩn từ thẻ meta của trang gốc
    let rawImageUrl = 
        $('meta[property="og:image"]').attr('content') || 
        $('meta[property="twitter:image"]').attr('content') || 
        $('article img').first().attr('src');

    await browser.close(); // Đóng trình duyệt trước khi tải ảnh để nhẹ máy

    // XỬ LÝ TẢI ẢNH BẰNG AXIOS (Không dùng page.goto)
    if (rawImageUrl) {
        try {
            // Xử lý link tương đối
            const imageUrl = new URL(rawImageUrl, url).href;

            // Tải ảnh bằng axios với Header giả lập
            const response = await axios.get(imageUrl, {
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0.0.0',
                    'Referer': url
                },
                timeout: 10000
            });

            // Tạo thư mục nếu chưa có
            if (!fs.existsSync('public/images/news')) {
                fs.mkdirSync('public/images/news', { recursive: true });
            }

            const fileName = `img_${Date.now()}.jpg`;
            const filePath = `public/images/news/${fileName}`;
            
            fs.writeFileSync(filePath, Buffer.from(response.data, 'binary'));
            
            return { content, imageUrl: `/images/news/${fileName}` };

        } catch (err) {
            console.error("❌ Không tải được ảnh gốc, bỏ qua:", err);
            return { content, imageUrl: null }; // Vẫn trả về content dù ảnh lỗi
        }
    }

    return { content, imageUrl: null };
    
  } catch (error: any) {
    if (browser) await browser.close();
    console.error("❌ LỖI SCRAPER:", error?.message || error);
    return { error: "Lỗi kết nối trình duyệt ảo hoặc web load quá lâu." };
  }
}