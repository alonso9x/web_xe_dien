import * as cheerio from 'cheerio';
import Parser from 'rss-parser';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as fs from 'fs';

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
        '--disable-dev-shm-usage'
      ]
    });
    
    const page = await browser.newPage();

    // Chặn tài nguyên không cần thiết để tăng tốc
    await page.setRequestInterception(true);
    page.on('request', (req: any) => {
      if (['stylesheet', 'font', 'media'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 720 });

    // Truy cập link báo
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Đợi 5s để load nội dung text
    await new Promise(resolve => setTimeout(resolve, 5000)); 

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

    // Lấy link ảnh
    let imageUrl = $('meta[property="og:image"]').attr('content') || $('img').first().attr('src') || null;

    // --- BẮT ĐẦU ĐOẠN CODE TẢI ẢNH ---
    if (imageUrl) {
        try {
            // Xử lý link tương đối (nếu thiếu http thì thêm vào)
            if (imageUrl.startsWith('/')) imageUrl = new URL(imageUrl, url).href;

            const viewSource = await page.goto(imageUrl);
            if (viewSource) {
                const buffer = await viewSource.buffer();
                
                // Tạo thư mục nếu chưa có
                if (!fs.existsSync('public/images')) {
                    fs.mkdirSync('public/images', { recursive: true });
                }

                // Dùng timestamp làm tên file
                const fileName = `img_${Date.now()}.jpg`;
                fs.writeFileSync(`public/images/${fileName}`, buffer);
                
                // Cập nhật lại đường dẫn ảnh để lưu vào DB/JSON
                imageUrl = `/images/${fileName}`;
            }
        } catch (err) {
            console.error("Không tải được ảnh, bỏ qua:", err);
        }
    }
    // --- KẾT THÚC ĐOẠN TẢI ẢNH ---

    await browser.close();
    return { content, imageUrl };
    
  } catch (error: any) {
    if (browser) await browser.close();
    // In hẳn cái lỗi thật ra xem nó báo cái gì anh nhé
    console.error("❌ LỖI THẬT SỰ ĐÂY ANH ĐẠO ĐỪNG BỎ QUA:", error?.message || error);
    return { error: "Lỗi kết nối trình duyệt ảo hoặc web load quá lâu." };
  }
}