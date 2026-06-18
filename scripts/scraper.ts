import * as cheerio from 'cheerio';
import Parser from 'rss-parser';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

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

    // --- CHÈN ĐOẠN NÀY VÀO ĐÂY ---
    await page.setRequestInterception(true);
    page.on('request', (req: any) => {
      if (['stylesheet', 'font', 'media'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });
    // ----------------------------

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 720 });

    // Truy cập link báo
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // LƯU Ý: Anh đang để 30 giây (30000), trên VPS rất dễ bị quá tải. 
    // Nếu vẫn lỗi timeout, anh giảm xuống 5000 (5 giây) là đủ để web load text rồi!
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

    let imageUrl = $('meta[property="og:image"]').attr('content') || $('img').first().attr('src') || null;

    await browser.close();
    return { content, imageUrl };
    
  } catch (error) {
    if (browser) await browser.close();
    return { error: "Lỗi kết nối trình duyệt ảo hoặc web load quá lâu." };
  }
}