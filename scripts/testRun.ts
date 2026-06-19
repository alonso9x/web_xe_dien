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
  console.log("🚀 BẮT ĐẦU QUÁ TRÌNH TỰ ĐỘNG CÀO TIN CHUYÊN SÂU...");
  
  // ========================================================
  // 🎯 DANH SÁCH TỪ KHÓA MỤC TIÊU CỦA ANH
  // ========================================================
  const targetKeywords = [
    "Powelldd",
    "TMT e-moto",
    "Aima tech",
    "kiến thức sử dụng xe máy điện",
    "mẹo bảo dưỡng xe điện",
    "kinh nghiệm đi xe máy điện"
  ];

  let newsList: any[] = [];

  // Vòng lặp đi gom tin từ tất cả từ khóa
  for (const kw of targetKeywords) {
    console.log(`🔍 Đang quét tin tức cho từ khóa: "${kw}"...`);
    const links = await getLatestNewsLinks(kw);
    if (links && links.length > 0) {
      // Lấy 2 bài mới nhất của mỗi từ khóa để cho vào hàng đợi
      newsList = newsList.concat(links.slice(0, 2));
    }
  }

  // Lọc trùng link nếu các từ khóa vô tình cào trùng nhau
  newsList = newsList.filter((value, index, self) =>
    self.findIndex(t => t.link === value.link) === index
  );

  if (newsList.length === 0) {
    console.log("❌ Không tìm thấy bài viết mới nào thuộc các chủ đề trên.");
    return;
  }

  console.log(`\n📌 Tổng cộng gom được ${newsList.length} bài tin tiềm năng. Bắt đầu sàng lọc...`);

  let success = false; 

  for (let i = 0; i < newsList.length; i++) {
    const news = newsList[i];
    const sourceUrl = news.link || "";
    
    console.log(`\n➡️ Đang thử bài [${i + 1}/${newsList.length}]: ${news.title}`);
    
    const scrapedData = await fetchNewsContent(sourceUrl);
    
    if (!scrapedData || scrapedData.error) {
      console.log(`⏭️ Bỏ qua: ${scrapedData?.error || "Không bóc được dữ liệu"}`);
      continue;
    }

    if (!scrapedData.content || scrapedData.content.length < 200) {
      console.log("⏭️ Bỏ qua: Nội dung quá ngắn.");
      continue; 
    }

    console.log(`✅ Bài này ĐẠT TIÊU CHUẨN! Đang gửi cho AI viết lại...`);
    const aiResult = await rewriteArticle(scrapedData.content, news.title || "");

    if (aiResult) {
      const contentString = Array.isArray(aiResult.content) 
          ? aiResult.content.join('\n\n') 
          : String(aiResult.content);

      console.log("\n==============================================");
      console.log("🎉 KẾT QUẢ AI ĐÃ VIẾT XONG.");
      console.log("==============================================\n");
      
      const dir = path.join(process.cwd(), 'public');
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir, { recursive: true });
      }
      const filePath = path.join(dir, 'newsData.json');

      let currentData: any[] = [];
      if (fs.existsSync(filePath)) {
        try {
          const fileContents = fs.readFileSync(filePath, 'utf8');
          const parsed = JSON.parse(fileContents);
          currentData = Array.isArray(parsed) ? parsed : [parsed]; 
        } catch (e) {
          console.log("⚠️ File JSON cũ trống hoặc lỗi, bắt đầu tạo mảng mới.");
        }
      }

      const finalTitle = aiResult.newTitle || news.title;
      const isDuplicate = currentData.some(item => item.title === finalTitle);
      
      if (isDuplicate) {
        console.log(`❌ BỎ QUA: Bài viết "${finalTitle}" đã có trên web! Chuyển bài tiếp theo...`);
        continue; 
      }

      // 🛑 BỘ LỌC ẢNH: XỬ LÝ DÂN TRÍ VÀ ẢNH LỖI
      let finalImage = scrapedData.imageUrl;

      if (sourceUrl.includes('dantri.com.vn')) {
          console.log("🛑 Nguồn Dân Trí: Chủ động bỏ qua ảnh gốc, dùng ảnh mặc định.");
          finalImage = "/images/default-news.jpg"; 
      } 
      else if (!finalImage || !finalImage.startsWith('http') || finalImage.length < 10) {
          console.log("⚠️ Ảnh cào về bị lỗi hoặc rỗng, đã dùng ảnh mặc định!");
          finalImage = "/images/default-news.jpg";
      }

      // Đóng gói dữ liệu bài viết
      const articleData = {
          id: generateSlug(finalTitle), 
          category: "Tin Tức",
          title: finalTitle,
          excerpt: aiResult.excerpt,
          content: contentString,
          imageUrl: finalImage, 
          createdAt: new Date().toISOString()
      };

      currentData.unshift(articleData);
      if (currentData.length > 50) currentData.length = 50;

      fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), 'utf8');
      console.log(`✅ Đã thêm bài viết mới vào kho dữ liệu! (ID: ${articleData.id})`);
      
      success = true;
      break; // Đã lên được 1 bài chất lượng đúng chủ đề, dừng cuộc chơi đi ngủ!
    } else {
      console.log("⚠️ AI xử lý lỗi, thử bài tiếp theo...");
    }
  }

  if (!success) {
    console.log("\n❌ Đã quét hết các chủ đề nhưng không có bài nào mới hoặc lỗi AI. Hệ thống đi ngủ!");
  }
}

run();