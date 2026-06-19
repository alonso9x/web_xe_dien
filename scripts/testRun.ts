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

// HÀM CHECK ẢNH MỚI: Bổ sung Header để lách chặn bot
async function checkImage(url: string | null | undefined): Promise<{ valid: boolean; reason: string }> {
  if (!url || typeof url !== 'string' || !url.startsWith('http') || url.length < 10) 
    return { valid: false, reason: "URL sai/trống" };

  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Referer': new URL(url).origin,
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    });
    
    if (response.ok) return { valid: true, reason: "OK" };
    return { valid: false, reason: `HTTP Status ${response.status}` };
  } catch (e: any) {
    return { valid: false, reason: e.message || "Connection Failed" };
  }
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

  // PHÂN LOẠI: Bài xịn (ảnh sống) và Bài dự phòng (ảnh chết)
  let healthyQueue: any[] = [];
  let fallbackQueue: any[] = [];

  console.log(`\n📌 Tổng cộng gom được ${newsList.length} bài. Đang sàng lọc ảnh...`);

  for (const news of newsList) {
    const scrapedData = await fetchNewsContent(news.link);
    if (!scrapedData || scrapedData.error || !scrapedData.content || scrapedData.content.length < 200) {
      console.log(`⏭️ Bỏ qua: ${scrapedData?.error || "Không bóc được dữ liệu hoặc bài quá ngắn"}`);
      continue;
    }

    // --- CẢI TIẾN: Gộp đường dẫn tương đối thành tuyệt đối ---
    let imageUrl = scrapedData.imageUrl;
    if (imageUrl && !imageUrl.startsWith('http')) {
      try {
        // Tự động ghép tên miền từ link gốc vào ảnh
        imageUrl = new URL(imageUrl, news.link).href;
      } catch (e) {
        // Nếu fail thì giữ nguyên để checkImage xử lý
      }
    }

    const imgStatus = await checkImage(imageUrl);
    
    // Cập nhật lại scrapedData với link đã chuẩn hóa
    const finalScrapedData = { ...scrapedData, imageUrl: imageUrl };

    if (imgStatus.valid) {
      healthyQueue.push({ ...news, ...finalScrapedData });
    } else {
      console.log(`⚠️ Bài "${news.title}" ảnh lỗi [${imgStatus.reason}]. Link: ${imageUrl}, đẩy vào dự phòng.`);
      fallbackQueue.push({ ...news, ...finalScrapedData });
    }
  }

  // BẮT ĐẦU XỬ LÝ AI
  let success = false;
  let finalItem: any = null;
  let finalAiResult: any = null;

  // 1. Ưu tiên bài healthyQueue
  for (let i = 0; i < healthyQueue.length; i++) {
    const item = healthyQueue[i];
    console.log(`\n➡️ Đang thử bài [${i + 1}/${healthyQueue.length} - Hàng xịn]: ${item.title}`);
    
    const aiResult = await rewriteArticle(item.content, item.title);
    if (aiResult) {
      finalItem = item;
      finalAiResult = aiResult;
      success = true;
      break;
    }
  }

  // 2. Nếu healthyQueue tạch hết, bốc random 1 bài từ fallbackQueue
  if (!success && fallbackQueue.length > 0) {
    console.log("\n🚨 Hàng xịn đã tạch hết, đang bốc thăm 1 bài từ hàng dự phòng...");
    const randomIdx = Math.floor(Math.random() * fallbackQueue.length);
    const item = fallbackQueue[randomIdx];
    
    console.log(`➡️ Đang thử cứu bài: ${item.title}`);
    const aiResult = await rewriteArticle(item.content, item.title);
    if (aiResult) {
      finalItem = item;
      finalAiResult = aiResult;
      success = true;
    }
  }

  // GHI FILE JSON (Giữ nguyên logic cũ của ông)
  if (success && finalItem && finalAiResult) {
    const contentString = Array.isArray(finalAiResult.content) 
        ? finalAiResult.content.join('\n\n') 
        : String(finalAiResult.content);

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

    const finalTitle = finalAiResult.newTitle || finalItem.title;
    const isDuplicate = currentData.some(item => item.title === finalTitle);
    
    if (isDuplicate) {
      console.log(`❌ BỎ QUA: Bài viết "${finalTitle}" đã có trên web!`);
    } else {
      // XỬ LÝ ẢNH (Giữ nguyên logic Dantri và Default)
      let finalImage = finalItem.imageUrl;
      if (finalItem.link && finalItem.link.includes('dantri.com.vn')) {
          console.log("🛑 Nguồn Dân Trí: Chủ động bỏ qua ảnh gốc.");
          finalImage = "/images/default-news.jpg"; 
      } else if (!healthyQueue.includes(finalItem)) {
          console.log("⚠️ Bài từ dự phòng, dùng ảnh mặc định!");
          finalImage = "/images/default-news.jpg";
      }

      const articleData = {
          id: generateSlug(finalTitle), 
          category: "Tin Tức",
          title: finalTitle,
          excerpt: finalAiResult.excerpt,
          content: contentString,
          imageUrl: finalImage, 
          createdAt: new Date().toISOString()
      };

      currentData.unshift(articleData);
      if (currentData.length > 50) currentData.length = 50;

      fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), 'utf8');
      console.log(`✅ Đã thêm bài viết mới vào kho dữ liệu! (ID: ${articleData.id})`);
    }
  } else {
    console.log("\n❌ Đã quét hết các chủ đề nhưng không có bài nào mới hoặc lỗi AI.");
  }
}

run();