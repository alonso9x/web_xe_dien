import { getLatestNewsLinks, fetchNewsContent } from './scraper';
import { rewriteArticle } from './aiService';
import * as fs from 'fs';
import path from 'path';

// Hàm tự động đẻ ra ID siêu chuẩn từ tiêu đề
function generateSlug(text: string) {
  return text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function run() {
  console.log("🚀 BẮT ĐẦU QUÁ TRÌNH TỰ ĐỘNG CÀO TIN...");
  
  const keyword = "xe máy điện"; 
  console.log(`📌 Đang tìm kiếm 5 tin tức mới nhất cho từ khóa: "${keyword}"\n`);
  
  const newsList = await getLatestNewsLinks(keyword);
  if (!newsList || newsList.length === 0) {
    console.log("❌ Không tìm thấy bài viết nào trên Google News.");
    return;
  }

  let success = false; 

  for (let i = 0; i < newsList.length; i++) {
    const news = newsList[i];
    console.log(`\n➡️ Đang thử bài [${i + 1}/5]: ${news.title}`);
    
    const scrapedData = await fetchNewsContent(news.link || "");
    
    if (!scrapedData || scrapedData.error) {
      console.log(`⏭️ Bỏ qua: ${scrapedData?.error || "Không bóc được dữ liệu"}`);
      continue;
    }

    if (!scrapedData.content || scrapedData.content.length < 200) {
      console.log("⏭️ Bỏ qua: Nội dung quá ngắn.");
      continue; 
    }

    console.log(`✅ Bài này NGON! Đang gửi cho AI viết lại...`);
    const aiResult = await rewriteArticle(scrapedData.content, news.title || "");

    if (aiResult) {
      const contentString = Array.isArray(aiResult.content) 
          ? aiResult.content.join('\n\n') 
          : String(aiResult.content);

      console.log("\n==============================================");
      console.log("🎉 KẾT QUẢ AI ĐÃ VIẾT XONG.");
      console.log("==============================================\n");
      
      // --- BẮT ĐẦU ĐOẠN XỬ LÝ LƯU FILE CHỐNG TRÙNG VÀ TẠO ID ---
      const dir = path.join(process.cwd(), 'public');
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir, { recursive: true });
      }
      const filePath = path.join(dir, 'newsData.json');

      // 1. Đọc dữ liệu cũ lên (Nếu có)
      let currentData: any[] = [];
      if (fs.existsSync(filePath)) {
        try {
          const fileContents = fs.readFileSync(filePath, 'utf8');
          const parsed = JSON.parse(fileContents);
          // Ép kiểu về Mảng
          currentData = Array.isArray(parsed) ? parsed : [parsed]; 
        } catch (e) {
          console.log("⚠️ File JSON cũ trống hoặc lỗi, bắt đầu tạo mảng mới.");
        }
      }

      // 2. Chốt chặn chống trùng lặp
      const finalTitle = aiResult.newTitle || news.title;
      const isDuplicate = currentData.some(item => item.title === finalTitle);
      
      if (isDuplicate) {
        console.log(`❌ BỎ QUA: Bài viết "${finalTitle}" đã có trên web! Chuyển sang bài tiếp theo...`);
        continue; // Nhảy sang cào bài tiếp theo ngay
      }

      // 3. Đóng gói bài viết xịn xò
      const articleData = {
          id: generateSlug(finalTitle), // ID ở đây rồi!
          category: "Tin Tức",
          title: finalTitle,
          excerpt: aiResult.excerpt,
          content: contentString,
          imageUrl: scrapedData.imageUrl,
          createdAt: new Date().toISOString()
      };

      // 4. Bơm lên đầu danh sách và giữ 50 bài mới nhất cho mượt web
      currentData.unshift(articleData);
      if (currentData.length > 50) currentData.length = 50;

      fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), 'utf8');
      console.log(`✅ Đã thêm bài viết mới vào kho dữ liệu! (ID: ${articleData.id})`);
      // -------------------------------
      
      success = true;
      break; // Lấy được 1 bài mới là nghỉ, đợi mai chạy tiếp
    } else {
      console.log("⚠️ AI xử lý lỗi, thử bài tiếp theo...");
    }
  }

  if (!success) {
    console.log("\n❌ Đã thử hết 5 bài mới nhất nhưng toàn bộ đều đã bị trùng hoặc lỗi AI. Hệ thống đi ngủ!");
  }
}

run();