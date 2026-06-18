import { getLatestNewsLinks, fetchNewsContent } from './scraper';
import { rewriteArticle } from './aiService';

async function run() {
  console.log("🚀 BẮT ĐẦU QUÁ TRÌNH TỰ ĐỘNG CÀO TIN...");
  
  const keyword = "xe máy điện"; // Tôi đổi thành xe máy điện cho sát với ngành của anh
  console.log(`📌 Đang tìm kiếm 5 tin tức mới nhất cho từ khóa: "${keyword}"\n`);
  
  const newsList = await getLatestNewsLinks(keyword);
  if (!newsList || newsList.length === 0) {
    console.log("❌ Không tìm thấy bài viết nào trên Google News.");
    return;
  }

  let success = false; // Biến đánh dấu đã cào thành công chưa

  // VÒNG LẶP: Quét qua từng bài, bài nào ngon thì ăn, bài nào lỗi thì sang bài tiếp
  for (let i = 0; i < newsList.length; i++) {
    const news = newsList[i];
    console.log(`\n➡️ Đang thử bài [${i + 1}/5]: ${news.title}`);
    
    const scrapedData = await fetchNewsContent(news.link || "");
    
    if (!scrapedData || scrapedData.error) {
      console.log(`⏭️ Bỏ qua: ${scrapedData?.error || "Không bóc được dữ liệu (Có thể do báo chặn)"}`);
      continue; // Nhảy sang bài tiếp theo
    }

    if (!scrapedData.content || scrapedData.content.length < 200) {
      console.log("⏭️ Bỏ qua: Nội dung quá ngắn (Tin video hoặc bị ẩn).");
      continue; // Nhảy sang bài tiếp theo
    }

    // NẾU TÌM ĐƯỢC BÀI NGON -> Xử lý AI luôn
    console.log(`✅ Bài này NGON! Đang gửi cho AI viết lại...`);
    const aiResult = await rewriteArticle(scrapedData.content, news.title || "");

    if (aiResult) {
      const contentString = Array.isArray(aiResult.content) 
          ? aiResult.content.join('\n\n') 
          : String(aiResult.content);

      console.log("\n==============================================");
      console.log("🎉 KẾT QUẢ AI ĐÃ VIẾT XONG:");
      console.log("TÍT MỚI:", aiResult.newTitle);
      console.log("MÔ TẢ:", aiResult.excerpt);
      console.log("NỘI DUNG:\n", contentString.substring(0, 500) + "...\n(Nội dung còn dài...)");
      console.log("==============================================\n");
      
      success = true;
      break; // Xong việc thì đập vỡ vòng lặp, dừng tool
    } else {
      console.log("⚠️ AI xử lý lỗi, thử bài tiếp theo...");
    }
  }

  if (!success) {
    console.log("\n❌ Đã thử hết 5 bài mới nhất nhưng đều thất bại. Đợi ngày mai thử lại!");
  }
}

run();