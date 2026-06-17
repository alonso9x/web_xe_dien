'use client';

import { motion } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import { Clock, ArrowRight, MapPin, Phone, ArrowLeft } from "lucide-react";

// --- CUSTOM ICONS (Đồng bộ từ trang chủ) ---
const FacebookIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const MessengerIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.14 2 11.25c0 2.91 1.5 5.5 3.94 7.22.18.13.3.34.3.56v2.45c0 .4.46.62.77.38l2.84-2.19c.2-.15.44-.21.68-.18 1.13.16 2.29.25 3.47.25 5.523 0 10-4.14 10-9.25S17.523 2 12 2zm1.09 12.35l-2.48-2.65c-.2-.22-.55-.26-.8-.09l-3.23 2.17c-.36.24-.8-.2-.55-.57l3.66-5.59c.2-.3.57-.38.88-.19l2.48 1.55c.2.13.45.1.62-.07l3.52-3.35c.34-.32.84.14.58.53l-3.8 5.76c-.2.31-.57.4-.88.2z"/></svg>
);
const TiktokIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path><path d="M15 8v8a4 4 0 0 1-4 4"></path><path d="M15 4v4a4 4 0 0 0 4 4"></path></svg>
);

const elegantFont = Plus_Jakarta_Sans({ 
  subsets: ["latin", "vietnamese"], 
  weight: ["300", "400", "500", "600", "700"],
  display: "swap"
});

// --- DATA TIN TỨC (Đã cập nhật ảnh lỗi) ---
const newsList = [
  { id: 1, title: "Powelldd ra mắt dòng xe Dimoon thế hệ mới", date: "15/06/2026", category: "Sự kiện", image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop", excerpt: "Khám phá ngay siêu phẩm Dimoon với thiết kế mang hơi thở tương lai, trang bị công nghệ an toàn tối tân và hệ thống đèn LED ma trận đột phá." },
  { id: 2, title: "Ưu đãi tựu trường: Tặng ngay voucher 2 triệu", date: "10/06/2026", category: "Khuyến mãi", image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop", excerpt: "Cơ hội sắm xe điện xịn với mức giá cực hời dành riêng cho học sinh, sinh viên. Tặng kèm mũ bảo hiểm chính hãng và gói bảo dưỡng 2 năm." },
  { id: 3, title: "Hướng dẫn bảo dưỡng pin xe điện đúng cách", date: "05/06/2026", category: "Kinh nghiệm", image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800&auto=format&fit=crop", excerpt: "Để pin xe điện luôn bền bỉ và đạt hiệu suất cao nhất trong mùa mưa, bạn tuyệt đối không nên bỏ qua 5 lưu ý sống còn sau đây." }
];

export default function NewsPage() {
  return (
    <main className={`min-h-screen bg-[#F4F4F6] text-neutral-800 ${elegantFont.className} overflow-x-hidden font-light`}>
      
      {/* 1. HEADER (Đồng bộ trang chủ) */}
      <header className="fixed w-full top-0 bg-white/80 backdrop-blur-2xl z-50 border-b border-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex flex-col cursor-pointer hover:opacity-80 transition-opacity">
            <h1 className="text-2xl font-semibold tracking-widest uppercase text-black leading-none">Minh Anh</h1>
            <span className="text-[10px] font-medium tracking-widest text-neutral-500 uppercase mt-1">E-Scooter</span>
          </Link>
          
          <nav className="hidden lg:flex gap-10 text-[13px] font-semibold uppercase tracking-widest text-neutral-600">
            <Link href="/" className="hover:text-black transition-colors">Trang chủ</Link>
            <Link href="/#san-pham" className="hover:text-black transition-colors">Sản phẩm</Link>
            <Link href="/#cong-nghe" className="hover:text-black transition-colors">Công nghệ</Link>
            <Link href="/tin-tuc" className="text-black transition-colors">Tin tức</Link>
          </nav>

          <Link href="/#showroom" className="hidden md:flex items-center gap-2 bg-black text-white px-7 py-3 rounded-full text-sm font-semibold shadow-xl shadow-black/20 hover:scale-105 transition-transform">
            Liên hệ <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      {/* 2. HERO BANNER TIN TỨC */}
      <section className="pt-36 pb-16 px-6 bg-white border-b border-neutral-100 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-neutral-100 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-neutral-400 hover:text-black transition-colors mb-6">
            <ArrowLeft size={14} /> Trở về trang chủ
          </Link>
          <h2 className="text-5xl md:text-6xl font-semibold uppercase tracking-widest text-black mb-4">
            Tin tức <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 font-light italic">Minh Anh</span>
          </h2>
          <p className="text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Cập nhật những xu hướng công nghệ mới nhất, sự kiện ra mắt xe và các chương trình ưu đãi độc quyền từ hệ thống Minh Anh E-Scooter.
          </p>
        </div>
      </section>

      {/* 3. GRID TIN TỨC */}
      <section className="py-20 px-6 max-w-7xl mx-auto min-h-[50vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {newsList.map((news, idx) => (
            <motion.div 
              key={news.id} 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group cursor-pointer flex flex-col h-full bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-2xl hover:shadow-neutral-200/50 transition-all border border-neutral-100"
            >
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden mb-6">
                <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md text-black px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                  {news.category}
                </div>
                <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>

              <div className="flex flex-col flex-1 px-2 pb-2">
                <span className="text-neutral-400 text-[11px] font-medium tracking-widest mb-3 flex items-center gap-2 uppercase">
                  <Clock size={12} /> {news.date}
                </span>
                <h4 className="text-xl font-semibold mb-3 leading-snug group-hover:text-red-600 transition-colors">
                  {news.title}
                </h4>
                <p className="text-neutral-500 text-sm font-light leading-relaxed mb-6 line-clamp-3">
                  {news.excerpt}
                </p>
                <div className="mt-auto pt-4 border-t border-neutral-50 flex items-center text-xs font-semibold uppercase tracking-widest text-black group-hover:text-red-600 transition-colors">
                  Đọc chi tiết <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. FOOTER (Đồng bộ trang chủ) */}
      <footer className="bg-black text-white pt-24 pb-10 px-6 border-t-8 border-neutral-900 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 border-b border-neutral-800 pb-16 mb-8">
          <div className="lg:col-span-5">
            <h2 className="text-4xl font-semibold mb-4 uppercase tracking-widest leading-none">Minh Anh</h2>
            <span className="text-sm text-neutral-500 tracking-[0.4em] uppercase block mb-6">E-Scooter</span>
            <p className="text-neutral-400 text-sm leading-relaxed font-light max-w-sm mb-8">Nâng tầm phong cách di chuyển đô thị. Hệ thống phân phối các dòng xe điện Powelldd, TMT, Vinfast....chính hãng hàng đầu Việt Nam.</p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/profile.php?id=61585209534176" target="_blank" rel="noreferrer" className="bg-neutral-800 p-3 rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-sm"><FacebookIcon size={20} /></a>
              <a href="https://zalo.me/0917747777" target="_blank" rel="noreferrer" className="bg-neutral-800 p-3 rounded-full hover:bg-blue-500 transition-all shadow-sm flex items-center justify-center"><img src="/images/logo-zalo-tiktok-facebook/logo-zalo-footer.png" alt="Zalo" className="w-5 h-5 object-contain rounded-full" /></a>
              <a href="https://www.tiktok.com/@powelldd.long.bien" target="_blank" rel="noreferrer" className="bg-neutral-800 p-3 rounded-full hover:bg-gray-700 hover:text-white transition-all shadow-sm"><TiktokIcon size={20} /></a>
            </div>
          </div>
          <div className="lg:col-span-4">
            <h3 className="text-sm font-semibold mb-8 uppercase tracking-[0.2em] text-neutral-200">Trải nghiệm thực tế</h3>
            <div className="space-y-6 text-neutral-400 font-light text-sm">
              <a href="https://www.google.com/maps/search/?api=1&query=547+Nguyễn+Văn+Cừ,+Bồ+Đề,+Hà+Nội" target="_blank" rel="noreferrer" className="flex items-start gap-4 hover:text-white transition-colors"><MapPin className="shrink-0 text-white" size={18} /> Số 547 Nguyễn Văn Cừ, Bồ Đề, Hà Nội</a>
              <p className="flex items-center gap-4 hover:text-white transition-colors"><Phone className="shrink-0 text-white" size={18} /> <a href="tel:0917747777" className="text-xl font-medium tracking-wider">091.774.7777</a></p>
              <p className="flex items-center gap-4 hover:text-white transition-colors"><Clock className="shrink-0 text-white" size={18} /> 08:00 - 21:00 (Thứ 2 - Chủ Nhật)</p>
            </div>
          </div>
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold mb-8 uppercase tracking-[0.2em] text-neutral-200">Dịch vụ</h3>
            <ul className="space-y-4 font-medium text-sm text-neutral-400">
              <li><Link href="/" className="hover:text-white transition-colors">Chính sách bảo hành</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Hướng dẫn trả góp</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-neutral-500 text-[10px] font-medium uppercase tracking-[0.2em]">
          <p>© 2026 MINH ANH E-SCOOTER. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>

      {/* 5. NÚT LIÊN HỆ NỔI */}
      <div className="fixed bottom-6 right-6 z-[900] flex flex-col gap-5">
        <div className="relative w-14 h-14 group">
          <span className="absolute inset-0 rounded-full bg-[#0068FF] animate-ping opacity-60 group-hover:opacity-0 transition-opacity duration-300"></span>
          <motion.a href="https://zalo.me/0917747777" target="_blank" rel="noreferrer" animate={{ rotate: [0, -15, 15, -15, 15, 0, 0, 0, 0, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0 }} className="relative flex items-center justify-center w-full h-full rounded-full shadow-xl shadow-[#0068FF]/50 hover:scale-110 transition-transform overflow-hidden bg-white">
            <img src="/images/logo-zalo-tiktok-facebook/logo-zalo.png" alt="Zalo" className="w-full h-full object-cover" />
          </motion.a>
        </div>
        <div className="relative w-14 h-14 group">
          <span className="absolute inset-0 rounded-full bg-[#0084FF] animate-ping opacity-60 group-hover:opacity-0 transition-opacity duration-300" style={{ animationDelay: '0.5s' }}></span>
          <motion.a href="https://m.me/61585209534176" target="_blank" rel="noreferrer" animate={{ rotate: [0, -15, 15, -15, 15, 0, 0, 0, 0, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="relative flex items-center justify-center w-full h-full bg-gradient-to-tr from-[#00C6FF] to-[#0072FF] text-white rounded-full shadow-xl shadow-blue-500/50 hover:scale-110 transition-transform">
            <MessengerIcon size={34} />
          </motion.a>
        </div>
      </div>
    </main>
  );
}