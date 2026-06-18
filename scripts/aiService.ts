import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface ArticleResult {
  newTitle: string;
  excerpt: string;
  content: string;
}

export async function rewriteArticle(rawContent: string, originalTitle: string): Promise<ArticleResult | null> {
  // Sửa chính xác tên model về gemini-2.5-flash để chạy đúng cổng API hiện tại
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash", 
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
    Bạn là một chuyên gia truyền thông kỹ thuật của hệ thống "Xe Điện Minh Anh" (Showroom tại Số 547 Nguyễn Văn Cừ, Bồ Đề, Long Biên, Hà Nội).
    Nhiệm vụ của bạn là đọc nội dung bài báo dưới đây và viết lại thành một bài tin tức hoàn toàn mới. Ưu tiên đưa các thông tin về xe điện Powelldd, xe máy điện TMT.
    
    Yêu cầu:
    1. Giọng văn: Tích cực, trung lập, không thiên vị, không quảng cáo quá mức, tránh dùng từ "nhất"
    2. Chèn tự nhiên các cụm từ chuẩn SEO: "xe điện", "xe máy điện thông minh", "xe điện hottrend", "Powelldd", "xe đạp điện", "xe điện Hà Nội"
    3. Đưa góc nhìn đánh giá chuyên môn của Xe Điện Minh Anh vào bài viết. Không copy nguyên văn.
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
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return JSON.parse(responseText) as ArticleResult;
  } catch (error: any) {
    console.error("❌ LỖI TẠI AI SERVICE:", error?.message || error);
    return null;
  }
}