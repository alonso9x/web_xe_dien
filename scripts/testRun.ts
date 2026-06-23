import { getLatestNewsLinks, fetchNewsContent } from './scraper';
import { rewriteArticle } from './aiService';
import * as fs from 'fs';
import path from 'path';

// ========================================================
// HÀM CHỌN NGẪU NHIÊN CTA (Đa dạng hóa SEO & Chuyển đổi)
// ========================================================
function getRandomCTA(): string {
  const ctaTemplates = [
    `\n\n---\n💡 **Bạn đang tìm kiếm xe điện bền bỉ và chất lượng?** Khám phá ngay các mẫu xe mới nhất tại [Xe Điện Minh Anh](https://xedienminhanh.vn) để nhận ưu đãi hấp dẫn hôm nay!`,
    `\n\n---\n🛠️ **Xe máy điện tiết kiệm - an toàn - hiện đại.** Đến [Xe Điện Minh Anh](https://xedienminhanh.vn) để trải nghiệm dịch vụ bảo hành chính hãng và hỗ trợ kỹ thuật tận tâm nhất.`,
    `\n\n---\n🎯 **Lựa chọn thông minh cho di chuyển đô thị.** Xem ngay bảng giá chi tiết và các mẫu xe điện hot nhất thị trường tại [Xe Điện Minh Anh](https://xedienminhanh.vn).`,
    `\n\n---\n⚡ **Gia nhập cộng đồng di chuyển xanh cùng Xe Điện Minh Anh.** Liên hệ ngay [tại đây](https://xedienminhanh.vn) để nhận tư vấn miễn phí dòng xe phù hợp với nhu cầu của bạn.`,
    `\n\n---\n💰 **Mua xe điện giá tốt - Nhận quà liền tay.** Đừng bỏ lỡ cơ hội sở hữu chiếc xe ưng ý tại [Xe Điện Minh Anh](https://xedienminhanh.vn) với chính sách trả góp cực ưu đãi.`
  ];
  return ctaTemplates[Math.floor(Math.random() * ctaTemplates.length)];
}

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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/126.0.0.0',
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
  
  const targetKeywords = [
    "Powelldd",
    "TMT e-moto",
    "Aima tech",
    "kiến thức sử dụng xe máy điện",
    "mẹo bảo dưỡng xe điện",
    "kinh nghiệm đi xe máy điện"
  ];

  let newsList: any[] = [];

  for (const kw of targetKeywords) {
    console.log(`🔍 Đang quét tin tức cho từ khóa: "${kw}"...`);
    const links = await getLatestNewsLinks(kw);
    if (links && links.length > 0) {
      newsList = newsList.concat(links.slice(0, 2));
    }
  }

  newsList = newsList.filter((value, index, self) =>
    self.findIndex(t => t.link === value.link) === index
  );

  if (newsList.length === 0) {
    console.log("❌ Không tìm thấy bài viết mới nào thuộc các chủ đề trên.");
    return;
  }

  let healthyQueue: any[] = [];
  let fallbackQueue: any[] = [];

  console.log(`\n📌 Tổng cộng gom được ${newsList.length} bài. Đang sàng lọc ảnh...`);

  for (const news of newsList) {
    const scrapedData = await fetchNewsContent(news.link);
    if (!scrapedData || scrapedData.error || !scrapedData.content || scrapedData.content.length < 200) {
      console.log(`⏭️ Bỏ qua: ${scrapedData?.error || "Không bóc được dữ liệu hoặc bài quá ngắn"}`);
      continue;
    }

    let imageUrl = scrapedData.imageUrl;
    // Bổ sung thêm check .includes('images/') để an toàn nếu code scraper trả về thiếu dấu '/'
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.includes('images/')) {
      try {
        imageUrl = new URL(imageUrl, news.link).href;
      } catch (e) {
      }
    }

    // --- SỬA CHỖ NÀY: Logic check ảnh mới ---
    const finalScrapedData = { ...scrapedData, imageUrl: imageUrl };

    // Nếu ảnh là file local (đã lưu ở bước scraper), auto Healthy
    if (imageUrl && imageUrl.includes('images/')) {
        healthyQueue.push({ ...news, ...finalScrapedData });
    } else {
        // Chỉ chạy checkImage với link remote (nếu có)
        const imgStatus = await checkImage(imageUrl);
        if (imgStatus.valid) {
            healthyQueue.push({ ...news, ...finalScrapedData });
        } else {
            console.log(`⚠️ Bài "${news.title}" ảnh lỗi [${imgStatus.reason}]. Link: ${imageUrl}, đẩy vào dự phòng.`);
            fallbackQueue.push({ ...news, ...finalScrapedData });
        }
    }
  }

  // ========================================================
  // VÙNG THAY ĐỔI: TRỘN NGẪU NHIÊN DANH SÁCH BÀI ĐỦ ĐIỀU KIỆN
  // ========================================================
  let success = false;
  let finalItem: any = null;
  let finalAiResult: any = null;

  if (healthyQueue.length > 0) {
    console.log(`\n🎲 Tìm thấy ${healthyQueue.length} bài hàng xịn. Tiến hành trộn ngẫu nhiên để chọn bài...`);
    // Thuật toán Fisher-Yates để trộn mảng khách quan nhất
    for (let i = healthyQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [healthyQueue[i], healthyQueue[j]] = [healthyQueue[j], healthyQueue[i]];
    }
  }

  // BẮT ĐẦU XỬ LÝ AI VỚI DANH SÁCH ĐÃ ĐƯỢC TRỘN NGẪU NHIÊN
  for (let i = 0; i < healthyQueue.length; i++) {
    const item = healthyQueue[i];
    console.log(`\n🎲 [Lượt chọn ngẫu nhiên] Đang thử bài [${i + 1}/${healthyQueue.length} - Hàng xịn]: ${item.title}`);
    
    const aiResult = await rewriteArticle(item.content, item.title);
    if (aiResult) {
      finalItem = item;
      finalAiResult = aiResult;
      success = true;
      break;
    }
  }
  // ========================================================

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

  if (success && finalItem && finalAiResult) {
    const rawContent = Array.isArray(finalAiResult.content) 
        ? finalAiResult.content.join('\n\n') 
        : String(finalAiResult.content);
    
    // CHÈN CTA NGẪU NHIÊN VÀO CUỐI BÀI
    const contentString = rawContent + getRandomCTA();

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
      
      // ==========================================
      // VÙNG SỬA LỖI: LOGIC CHỌN ẢNH CHUẨN XÁC NHẤT
      // ==========================================
      let finalImage = finalItem.imageUrl;
      
      if (finalItem.link && finalItem.link.includes('dantri.com.vn')) {
          console.log("🛑 Nguồn Dân Trí: Chủ động bỏ qua ảnh gốc.");
          finalImage = "/images/default-news.jpg"; 
      } else if (!finalImage || finalImage.trim() === "") {
          console.log("⚠️ Không có ảnh hợp lệ, dùng ảnh mặc định!");
          finalImage = "/images/default-news.jpg";
      } else {
          // ÉP DẤU "/" VÀO ĐẦU NẾU CHƯA CÓ ĐỂ TRÁNH LỖI ĐƯỜNG DẪN TƯƠNG ĐỐI
          if (!finalImage.startsWith('/') && !finalImage.startsWith('http')) {
              finalImage = '/' + finalImage;
          }
          console.log(`✅ Sử dụng ảnh thành công: ${finalImage}`);
      }
      // ==========================================

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