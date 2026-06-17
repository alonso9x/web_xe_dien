'use client';

import { motion } from "framer-motion";
import { ArrowLeft, Clock, ArrowRight, MapPin, Phone } from "lucide-react";
import Link from "next/link";

// Giả sử anh có mảng tin tức (sau này fetch từ API)
const newsList = [
  { id: 1, title: "Powelldd ra mắt dòng xe Dimoon thế hệ mới", date: "15/06/2026", category: "Sự kiện", image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop", excerpt: "Khám phá ngay siêu phẩm Dimoon với thiết kế mang hơi thở tương lai..." },
  { id: 2, title: "Ưu đãi tựu trường: Tặng ngay voucher 2 triệu", date: "10/06/2026", category: "Khuyến mãi", image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop", excerpt: "Cơ hội sắm xe điện xịn với mức giá cực hời dành riêng cho học sinh..." },
  { id: 3, title: "Hướng dẫn bảo dưỡng pin xe điện đúng cách", date: "05/06/2026", category: "Kinh nghiệm", image: "https://images.unsplash.com/photo-1572051662580-b71569fa153d?q=80&w=800&auto=format&fit=crop", excerpt: "Để pin xe điện luôn bền bỉ và đạt hiệu suất cao nhất trong mùa mưa..." }
];

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-[#F4F4F6]">
      {/* Header đơn giản */}
      <header className="bg-white py-6 border-b border-neutral-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-black font-semibold uppercase tracking-widest">
            <ArrowLeft size={18} /> Quay lại trang chủ
          </Link>
          <h1 className="text-xl font-bold uppercase tracking-[0.2em]">Tin tức & Sự kiện</h1>
        </div>
      </header>

      {/* Grid danh sách tin */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {newsList.map((news) => (
            <motion.div key={news.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-4 rounded-[2rem] shadow-sm hover:shadow-xl transition-all">
              <div className="w-full aspect-[16/10] rounded-3xl overflow-hidden mb-6">
                <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
              </div>
              <div className="px-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full">{news.category}</span>
                <h2 className="text-xl font-semibold mt-4 mb-3">{news.title}</h2>
                <p className="text-neutral-500 text-sm leading-relaxed mb-6">{news.excerpt}</p>
                <Link href={`/tin-tuc/${news.id}`} className="flex items-center text-sm font-bold uppercase tracking-widest hover:text-red-600 transition-colors">
                  Đọc thêm <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer giữ nguyên phong cách */}
      <footer className="bg-black text-white py-10 text-center text-xs uppercase tracking-[0.2em]">
        © 2026 MINH ANH E-SCOOTER
      </footer>
    </main>
  );
}