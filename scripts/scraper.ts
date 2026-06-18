import * as cheerio from 'cheerio';
import Parser from 'rss-parser';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Kích hoạt lớp giáp tàng hình chống chặn Bot
puppeteer.use(StealthPlugin());
const parser = new Parser();

export async function getLatestNewsLinks(keyword: string) {
  try {
    const feed = await parser.parseURL(`https://news.google.com/rss/search?q=${encodeURIComponent(keyword)}&hl=vi&gl=VN&ceid=VN:vi`);
    if (feed.items && feed.items.length > 0) {
      // Trả về 5 bài mới nhất để làm mồi
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
    // Khởi động Chrome ẩn danh
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
    
    const page = await browser.newPage();
    
    // Giả dạng kích thước màn hình người dùng thật
    await page.setViewport({ width: 1280, height: 720 });

    // Truy cập link báo và chờ trang load xong
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 40000 });
    
    // NGHỈ CHÂN 3 GIÂY: Để lách qua màn hình chờ của Cloudflare và load hết JavaScript
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Rút ruột toàn bộ HTML của trang web sau khi đã load xong
    const html = await page.content();
    const $ = cheerio.load(html);
    
    // Kiểm tra xem có video không
    if ($('video').length > 0 || $('iframe[src*="youtube"]').length > 0) {
      await browser.close();
      return { error: "Bài viết chứa video, tự động bỏ qua." };
    }

    let content = '';
    // Vét sạch các đoạn văn bản (bao phủ cấu trúc của mọi loại báo lớn nhỏ)
    $('article p, .content p, .detail-content p, .detail-cmain p, .singular-content p, p').each((i: number, el: any) => {
      content += $(el).text().trim() + '\n\n';
    });

    // Bắt link ảnh chuẩn SEO của bài báo
    let imageUrl = $('meta[property="og:image"]').attr('content') || $('img').first().attr('src') || null;

    await browser.close();
    return { content, imageUrl };
    
  } catch (error) {
    if (browser) await browser.close();
    return { error: "Lỗi kết nối trình duyệt ảo hoặc web load quá lâu." };
  }
}