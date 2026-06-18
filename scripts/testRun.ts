import { getLatestNewsLinks, fetchNewsContent } from './scraper';
import { rewriteArticle } from './aiService';
import * as fs from 'fs';
import path from 'path';

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
      
      // --- ĐOẠN LƯU FILE NẰM Ở ĐÂY ---
      const articleData = {
          title: aiResult.newTitle,
          excerpt: aiResult.excerpt,
          content: contentString,
          imageUrl: scrapedData.imageUrl, // Lấy link ảnh từ dữ liệu cào
          createdAt: new Date().toISOString()
      };

      const dir = path.join(process.cwd(), 'public');
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir, { recursive: true });
      }
      
      const filePath = path.join(dir, 'newsData.json');
      fs.writeFileSync(filePath, JSON.stringify(articleData, null, 2));
      console.log("✅ Đã lưu xong dữ liệu vào: public/newsData.json");
      // -------------------------------
      
      success = true;
      break; 
    } else {
      console.log("⚠️ AI xử lý lỗi, thử bài tiếp theo...");
    }
  }

  if (!success) {
    console.log("\n❌ Đã thử hết 5 bài mới nhất nhưng đều thất bại. Đợi ngày mai thử lại!");
  }
}

run();