import fs from 'fs';
import path from 'path';
import axios from 'axios';
import cron from 'node-cron';
import { getLatestNewsLinks, fetchNewsContent } from './scraper';
import { rewriteArticle } from './aiService';

// HÀM 1: Tải ảnh từ báo về website của anh
async function downloadImage(url: string, filename: string) {
  const imgDir = path.join(process.cwd(), 'public', 'images', 'news');
  if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

  const filePath = path.join(imgDir, filename);
  const writer = fs.createWriteStream(filePath);

  const response = await axios({ url, method: 'GET', responseType: 'stream' });
  response.data.pipe(writer);

 return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(true)); // Thêm () => resolve(true) vào đây
    writer.on('error', reject);
  });
}

// HÀM 2: Lưu bài viết vào Database (File JSON)
function saveToDatabase(article: any) {
  const dbDir = path.join(process.cwd(), 'src', 'data');
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

  const dbPath = path.join(dbDir, 'newsData.json');
  let newsList = [];
  if (fs.existsSync(dbPath)) {
    newsList = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  }
  
  newsList.unshift(article); // Đẩy bài mới tinh lên đầu trang
  fs.writeFileSync(dbPath, JSON.stringify(newsList, null, 2), 'utf-8');
}

// HÀM 3: LUỒNG CHẠY CHÍNH
async function runAutoNews() {
  console.log(`\n[${new Date().toLocaleString('vi-VN')}] 🚀 KHỞI ĐỘNG BOT CÀO TIN...`);
  
  const news = await getLatestNewsLinks("xe máy điện");
  if (!news || !news.link) return console.log("❌ Không tìm thấy bài báo mới.");

  const scrapedData = await fetchNewsContent(news.link);
  if (!scrapedData) return console.log("❌ Không bóc được nội dung.");
  
  // Bỏ qua nếu có video
  if (scrapedData.error) return console.log(`⏭️ ${scrapedData.error}`);
  if (!scrapedData.content || scrapedData.content.length < 200) return console.log("❌ Nội dung rác/quá ngắn.");

  console.log(`🧠 Đang nhờ Gemini xào nấu...`);
  const aiResult = await rewriteArticle(scrapedData.content, news.title || "");

  if (aiResult) {
    let localImagePath = "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800&auto=format&fit=crop"; 

    // Tải ảnh về máy chủ
    if (scrapedData.imageUrl) {
      try {
        const imageName = `news-${Date.now()}.jpg`;
        console.log(`📸 Đang tải ảnh gốc về máy: ${scrapedData.imageUrl}`);
        await downloadImage(scrapedData.imageUrl, imageName);
        localImagePath = `/images/news/${imageName}`; // Đường dẫn để lên web Next.js
      } catch (e) {
        console.log("⚠️ Lỗi tải ảnh, dùng ảnh mặc định.");
      }
    }

    const contentString = Array.isArray(aiResult.content) ? aiResult.content.join('\n\n') : String(aiResult.content);

    // Đóng gói dữ liệu chuẩn form với Code trang tin tức ban đầu của anh
    const finalArticle = {
      id: Date.now(),
      title: aiResult.newTitle,
      date: new Date().toLocaleDateString('vi-VN'), // Ngày hiện tại
      category: "Điểm tin",
      image: localImagePath,
      excerpt: aiResult.excerpt,
      fullContent: contentString
    };

    saveToDatabase(finalArticle);
    console.log("✅ HOÀN TẤT: BÀI VIẾT VÀ ẢNH ĐÃ ĐƯỢC LƯU LÊN WEBSITE!\n");
  }
}

// ----------------------------------------------------
// THIẾT LẬP HẸN GIỜ (CRON JOB)
// ----------------------------------------------------
console.log("🟢 HỆ THỐNG AUTO-NEWS ĐÃ KÍCH HOẠT. ĐANG CHỜ ĐẾN 07:00 SÁNG...");

// Chạy định kỳ vào 07:00 sáng mỗi ngày theo giờ Việt Nam
cron.schedule('0 7 * * *', () => {
  runAutoNews();
}, {
  timezone: "Asia/Ho_Chi_Minh"
});