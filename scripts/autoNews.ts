import fs from 'fs';
import path from 'path';
import axios from 'axios';
import cron from 'node-cron';
import { exec } from 'child_process';
import { getLatestNewsLinks, fetchNewsContent } from './scraper';
import { rewriteArticle } from './aiService';

// ========================================================
// ĐỒ CHƠI ĐỘC QUYỀN 1: Tải ảnh từ báo về website (Dùng Axios Stream)
// ========================================================
async function downloadImage(url: string, filename: string): Promise<boolean> {
  const imgDir = path.join(process.cwd(), 'public', 'images', 'news');
  if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

  const filePath = path.join(imgDir, filename);
  const writer = fs.createWriteStream(filePath);

  const response = await axios({ url, method: 'GET', responseType: 'stream' });
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(true));
    writer.on('error', reject);
  });
}

// ========================================================
// ĐỒ CHƠI TỪ TESTRUN 1: Hàm check ảnh remote có bị chặn bot không
// ========================================================
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

// ========================================================
// ĐỒ CHƠI ĐỘC QUYỀN 2: Lưu bài viết vào Database chuẩn hệ thống chính
// ========================================================
function saveToDatabase(article: any) {
  const dbDir = path.join(process.cwd(), 'src', 'data');
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

  const dbPath = path.join(dbDir, 'newsData.json');
  let newsList: any[] = [];
  if (fs.existsSync(dbPath)) {
    try {
      newsList = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    } catch (e) {
      newsList = [];
    }
  }
  
  newsList.unshift(article); // Đẩy bài mới tinh lên đầu trang
  if (newsList.length > 50) newsList.length = 50; // Giới hạn kho dữ liệu 50 bài như bản testrun
  
  fs.writeFileSync(dbPath, JSON.stringify(newsList, null, 2), 'utf-8');
}

// ========================================================
// HÀM 3: LUỒNG CHẠY CHÍNH (ĐÃ ĐƯỢC BỌC GIÁP CHỐNG CRASH)
// ========================================================
async function runAutoNews() {
  console.log(`\n[${new Date().toLocaleString('vi-VN')}] 🚀 KHỞI ĐỘNG BOT CÀO TIN TỰ ĐỘNG CHUYÊN SÂU...`);
  
  const targetKeywords = [
    "Powelldd",
    "TMT e-moto",
    "Aima tech",
    "kiến thức sử dụng xe máy điện",
    "mẹo bảo dưỡng xe điện",
    "kinh nghiệm đi xe máy điện"
  ];

  let newsList: any[] = [];

  // 1. Quét tin tức gom bão theo các từ khóa của bản testrun
  for (const kw of targetKeywords) {
    console.log(`🔍 Đang quét tin tức cho từ khóa: "${kw}"...`);
    try {
      const links = await getLatestNewsLinks(kw);
      if (links && links.length > 0) {
        newsList = newsList.concat(links.slice(0, 2));
      }
    } catch (error: any) {
      console.log(`⚠️ Lỗi khi quét từ khóa "${kw}": ${error.message || "Unknown error"}. Bỏ qua chạy tiếp!`);
      continue;
    }
  }

  // Lọc trùng lặp link
  newsList = newsList.filter((value, index, self) =>
    self.findIndex(t => t.link === value.link) === index
  );

  if (newsList.length === 0) {
    console.log("❌ Không tìm thấy bài viết mới nào thuộc các chủ đề trên.");
    return;
  }

  let healthyQueue: any[] = [];
  let fallbackQueue: any[] = [];

  console.log(`\n📌 Tổng cộng gom được ${newsList.length} bài. Đang tiến hành sàng lọc chất lượng...`);

  // 2. Phân loại bài viết vào các rổ hàng xịn và dự phòng
  for (const news of newsList) {
    let scrapedData: any;
    
    try {
      scrapedData = await fetchNewsContent(news.link);
    } catch (error: any) {
      console.log(`⚠️ Trình duyệt lỗi khi bóc link: ${news.title}. Bỏ qua link này!`);
      continue;
    }

    if (!scrapedData || scrapedData.error || !scrapedData.content || scrapedData.content.length < 200) {
      console.log(`⏭️ Bỏ qua: ${scrapedData?.error || "Không bóc được dữ liệu hoặc bài quá ngắn"}`);
      continue;
    }

    let imageUrl = scrapedData.imageUrl;
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.includes('images/')) {
      try {
        imageUrl = new URL(imageUrl, news.link).href;
      } catch (e) {}
    }

    const finalScrapedData = { ...scrapedData, imageUrl: imageUrl };

    // Phân loại dựa trên trạng thái ảnh
    if (imageUrl && imageUrl.includes('images/')) {
        healthyQueue.push({ ...news, ...finalScrapedData });
    } else {
        const imgStatus = await checkImage(imageUrl);
        if (imgStatus.valid) {
            healthyQueue.push({ ...news, ...finalScrapedData });
        } else {
            console.log(`⚠️ Bài "${news.title}" ảnh lỗi [${imgStatus.reason}]. Đẩy vào dự phòng.`);
            fallbackQueue.push({ ...news, ...finalScrapedData });
        }
    }
  }

  // 3. Trộn ngẫu nhiên rổ hàng xịn (Thuật toán Fisher-Yates chuẩn testrun)
  if (healthyQueue.length > 0) {
    console.log(`\n🎲 Tìm thấy ${healthyQueue.length} bài hàng xịn. Tiến hành trộn ngẫu nhiên để chọn bài...`);
    for (let i = healthyQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [healthyQueue[i], healthyQueue[j]] = [healthyQueue[j], healthyQueue[i]];
    }
  }

  let success = false;
  let finalItem: any = null;
  let finalAiResult: any = null;

  // Xử lý AI với danh sách đã trộn ngẫu nhiên
  for (let i = 0; i < healthyQueue.length; i++) {
    const item = healthyQueue[i];
    console.log(`\n🎲 [Lượt chọn ngẫu nhiên] Đang xử lý bài [${i + 1}/${healthyQueue.length} - Hàng xịn]: ${item.title}`);
    
    try {
      const aiResult = await rewriteArticle(item.content, item.title);
      if (aiResult) {
        finalItem = item;
        finalAiResult = aiResult;
        success = true;
        break;
      }
    } catch (error) {
      console.log(`⚠️ Lỗi AI khi xử lý bài "${item.title}". Thử bài tiếp theo...`);
      continue;
    }
  }

  // Nếu hàng xịn tạch hết thì cứu bốc thăm từ hàng dự phòng
  if (!success && fallbackQueue.length > 0) {
    console.log("\n🚨 Hàng xịn đã tạch hết, đang bốc thăm cứu trợ 1 bài từ hàng dự phòng...");
    const randomIdx = Math.floor(Math.random() * fallbackQueue.length);
    const item = fallbackQueue[randomIdx];
    
    console.log(`➡️ Đang thử cứu bài: ${item.title}`);
    try {
      const aiResult = await rewriteArticle(item.content, item.title);
      if (aiResult) {
        finalItem = item;
        finalAiResult = aiResult;
        success = true;
      }
    } catch (error) {
      console.log(`⚠️ Lỗi AI khi cứu bài dự phòng.`);
    }
  }

  // 4. Nếu xử lý thành công, tiến hành tải ảnh thực tế và lưu chuẩn form autonews
  if (success && finalItem && finalAiResult) {
    const contentString = Array.isArray(finalAiResult.content) 
        ? finalAiResult.content.join('\n\n') 
        : String(finalAiResult.content);

    const finalTitle = finalAiResult.newTitle || finalItem.title;

    // Đọc DB hiện tại ở src/data để kiểm tra trùng bài
    const dbPath = path.join(process.cwd(), 'src', 'data', 'newsData.json');
    let currentData: any[] = [];
    if (fs.existsSync(dbPath)) {
      try {
        currentData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      } catch (e) {
        currentData = [];
      }
    }

    const isDuplicate = currentData.some(item => item.title === finalTitle);
    
    if (isDuplicate) {
      console.log(`❌ BỎ QUA: Bài viết "${finalTitle}" đã tồn tại trong database hệ thống!`);
      return;
    }

    // --- XỬ LÝ LƯU ẢNH VÀO WEB ---
    let localImagePath = "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800&auto=format&fit=crop"; 
    let finalImage = finalItem.imageUrl;
    
    if (finalItem.link && finalItem.link.includes('dantri.com.vn')) {
        console.log("🛑 Nguồn Dân Trí: Chủ động bỏ qua ảnh gốc, dùng mặc định.");
    } else if (!finalImage || finalImage.trim() === "") {
        console.log("⚠️ Không có ảnh hợp lệ, dùng ảnh mặc định!");
    } else if (finalImage.includes('images/')) {
        localImagePath = finalImage.startsWith('/') ? finalImage : '/' + finalImage;
        console.log(`✅ Sử dụng đường dẫn ảnh local: ${localImagePath}`);
    } else if (finalImage.startsWith('http')) {
        try {
          const imageName = `news-${Date.now()}.jpg`;
          console.log(`📸 Đang tải ảnh gốc về máy chủ: ${finalImage}`);
          await downloadImage(finalImage, imageName);
          localImagePath = `/images/news/${imageName}`;
          console.log(`✅ Tải và lưu ảnh thành công: ${localImagePath}`);
        } catch (e) {
          console.log("⚠️ Lỗi tải ảnh từ báo gốc, fallback về ảnh mặc định.");
        }
    }

    // Đóng gói đúng cấu trúc trường dữ liệu
    const finalArticle = {
      id: Date.now(),
      title: finalTitle,
      date: new Date().toLocaleDateString('vi-VN'), 
      category: "Điểm tin",
      image: localImagePath,
      excerpt: finalAiResult.excerpt,
      fullContent: contentString
    };

    saveToDatabase(finalArticle);
    
    // Tự động chạy tạo sitemap sau khi lưu bài thành công
    console.log("🔄 Đang chạy script cập nhật Sitemap...");
    exec('node scripts/generateSitemap.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`⚠️ Lỗi khi tự động cập nhật Sitemap: ${error.message}`);
        } else {
            console.log("✅ Sitemap đã được cập nhật thành công.");
        }
    });

    console.log("\n==============================================");
    console.log("✅ HOÀN TẤT: BÀI VIẾT NGẪU NHIÊN ĐÃ ĐƯỢC ĐĂNG TỰ ĐỘNG LÊN WEB!");
    console.log("==============================================\n");

  } else {
    console.log("\n❌ Kết thúc tiến trình: Không có bài nào mới hoặc lỗi AI.");
  }
}

// ----------------------------------------------------
// ĐỒ CHƠI ĐỘC QUYỀN 3: THIẾT LẬP HẸN GIỜ CHẠY NGẦM (CRON JOB)
// ----------------------------------------------------
console.log("🟢 HỆ THỐNG AUTO-NEWS ĐÃ KÍCH HOẠT. ĐANG CHỜ ĐẾN 07:00 SÁNG...");

// Chạy định kỳ vào đúng 07:00 sáng mỗi ngày theo giờ Việt Nam
cron.schedule('0 7 * * *', async () => {
  try {
    await runAutoNews();
  } catch (error) {
    console.error(`\n❌ LỖI NGHIÊM TRỌNG TỚI MỨC CRASH BOT LÚC 7H SÁNG:`, error);
  }
}, {
  timezone: "Asia/Ho_Chi_Minh"
});