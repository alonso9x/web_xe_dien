import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Chỉ sử dụng đúng 3 model ông yêu cầu
const MODELS = ["gemini-3.1-flash-lite", "gemini-3.5-flash", "gemini-2.5-flash"];
let modelIndex = 0;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface ArticleResult {
  newTitle: string;
  excerpt: string;
  content: string;
}

export async function rewriteArticle(rawContent: string, originalTitle: string): Promise<ArticleResult | null> {
  const modelName = MODELS[modelIndex];
  
  const model = genAI.getGenerativeModel({ 
    model: modelName, 
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
    Bạn là một chuyên gia truyền thông kỹ thuật của hệ thống "Xe Điện Minh Anh" (Showroom tại Số 547 Nguyễn Văn Cừ, Bồ Đề, Long Biên, Hà Nội).
    Nhiệm vụ của bạn là đọc nội dung bài báo dưới đây và viết lại thành một bài tin tức hoàn toàn mới và tự nhiên. Ưu tiên đưa các thông tin về xe điện, xe máy điện, xe đạp điện.
    
    Yêu cầu:
    1. Giọng văn: Tích cực, trung lập, không thiên vị, không quảng cáo quá mức, không dùng dấu * trong câu trả lời của bạn.
    2. Chèn tự nhiên các cụm từ chuẩn SEO về xe điện.
    3. Đưa góc nhìn đánh giá chuyên môn của Xe Điện Minh Anh vào bài viết. Không copy nguyên văn. Dòng cuối cùng lệch lề phải viết "Xe điện Minh Anh - Chất lượng cao tạo niềm tin". 
    4. BẮT BUỘC TRẢ VỀ ĐÚNG CẤU TRÚC JSON SAU (Không thêm bất kỳ văn bản nào khác ngoài JSON):
    {
      "newTitle": "Tiêu đề mới giật tít",
      "excerpt": "Mô tả ngắn gọn khoảng 2-3 câu",
      "content": "Nội dung chi tiết viết liền, có chia đoạn bằng các ký tự xuống dòng (\\n\\n)"
    }

    --- BÀI GỐC ---
    Tiêu đề: ${originalTitle}
    Nội dung: ${rawContent}
  `;

  try {
    console.log(`Đang xử lý với model: ${modelName}`);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Thành công: nghỉ 3 giây để tránh quota burst
    await sleep(3000); 
    return JSON.parse(responseText) as ArticleResult;

  } catch (error: any) {
    // Nếu gặp lỗi 429 hoặc lỗi model không khả dụng, chuyển model
    console.warn(`⚠️ Lỗi với ${modelName}, đang thử chuyển model...`);
    
    modelIndex = (modelIndex + 1) % MODELS.length; // Chuyển sang model kế tiếp
    await sleep(5000); // Đợi 5 giây trước khi thử lại với model mới
    
    return rewriteArticle(rawContent, originalTitle); // Đệ quy: Thử lại với model mới
  }
}