import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import { Clock, ArrowRight, MapPin, Phone, ArrowLeft } from "lucide-react";
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// --- BỔ SUNG SEO TĨNH CHO TRANG DANH SÁCH ---
export const metadata: Metadata = {
  title: "Tin Tức & Sự Kiện Xe Điện | Xe Điện Minh Anh Long Biên",
  description: "Cập nhật tin tức mới nhất về thị trường xe điện, các mẹo sử dụng xe bền bỉ và chương trình khuyến mãi hấp dẫn từ Hệ thống Xe điện Long Biên - Minh Anh.",
  alternates: {
    canonical: "https://xedienminhanh.vn/tin-tuc",
  },
  openGraph: {
    title: "Tin Tức & Sự Kiện Xe Điện | Xe Điện Minh Anh Long Biên",
    description: "Cập nhật tin tức mới nhất, mẹo hay và khuyến mãi xe điện.",
    url: "https://xedienminhanh.vn/tin-tuc",
  }
};

const elegantFont = Plus_Jakarta_Sans({ 
  subsets: ["latin", "vietnamese"], 
  weight: ["300", "400", "500", "600", "700"],
  display: "swap"
});

// Hàm đọc và chuẩn hóa dữ liệu tinh vi
async function getNewsData() {
  try {
    let filePath = path.join(process.cwd(), 'public', 'newsData.json');
    if (!fs.existsSync(filePath)) {
      filePath = '/var/www/shop-xe-dien/public/newsData.json';
    }
    
    if (!fs.existsSync(filePath)) return [];
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    const rawItems = Array.isArray(data) ? data : [data];
    
    return rawItems.map((item: any, index: number) => {
      let finalImage = item.imageUrl || item.image || "/images/default-news.jpg";
      if (finalImage && !finalImage.startsWith('http') && !finalImage.startsWith('/')) {
        finalImage = '/' + finalImage;
      }

      return {
        id: item.id || `bai-viet-${index + 1}`,
        category: item.category || "Hot Trend",
        image: finalImage,
        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : (item.date || "Vừa cập nhật"),
        title: item.title || "Tin tức xe điện mới nhất",
        excerpt: item.excerpt || ""
      };
    });
  } catch (error) {
    console.error("Lỗi đồng bộ dữ liệu JSON:", error);
    return [];
  }
}

export default async function NewsPage() {
  const newsList = await getNewsData();

  // SCHEMA CHUẨN GOOGLE CHO TRANG DANH SÁCH BÀI VIẾT
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Tin Tức Xe Điện Minh Anh",
    "url": "https://xedienminhanh.vn/tin-tuc",
    "description": "Cập nhật tin tức mới nhất về thị trường xe điện, các mẹo sử dụng xe bền bỉ."
  };

  return (
    <main className={`min-h-screen bg-[#F4F4F6] text-neutral-800 ${elegantFont.className} overflow-x-hidden font-light`}>
      {/* Gắn Schema vào DOM */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 1. HEADER */}
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
            Cập nhật những xu hướng công nghệ mới nhất, sự kiện ra mắt xe và tin tức nóng hổi từ hệ thống Minh Anh E-Scooter.
          </p>
        </div>
      </section>

      {/* 3. GRID TIN TỨC */}
      <section className="py-20 px-6 max-w-7xl mx-auto min-h-[50vh]">
        {!Array.isArray(newsList) || newsList.length === 0 ? (
          <div className="text-center text-neutral-500 py-10">
            Chưa có bài viết nào. Đang chờ hệ thống AI cập nhật tin tức...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {newsList.map((news: any) => (
              <Link 
                href={`/tin-tuc/${news.id}`} 
                key={news.id} 
                className="group cursor-pointer flex flex-col h-full bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-2xl hover:shadow-neutral-200/50 hover:-translate-y-2 transition-all duration-300 border border-neutral-100"
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
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 4. FOOTER */}
      <footer className="bg-black text-white pt-24 pb-10 px-6 border-t-8 border-neutral-900 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 border-b border-neutral-800 pb-16 mb-8">
          <div className="lg:col-span-5">
            <h2 className="text-4xl font-semibold mb-4 uppercase tracking-widest leading-none">Minh Anh</h2>
            <span className="text-sm text-neutral-500 tracking-[0.4em] uppercase block mb-6">E-Scooter</span>
            <p className="text-neutral-400 text-sm leading-relaxed font-light max-w-sm mb-8">Nâng tầm phong cách di chuyển đô thị. Hệ thống phân phối các dòng xe điện Powelldd, TMT, Vinfast....chính hãng hàng đầu Việt Nam.</p>
          </div>
          <div className="lg:col-span-4">
            <h3 className="text-sm font-semibold mb-8 uppercase tracking-[0.2em] text-neutral-200">Trải nghiệm thực tế</h3>
            <div className="space-y-6 text-neutral-400 font-light text-sm">
              <a href="#" className="flex items-start gap-4 hover:text-white transition-colors"><MapPin className="shrink-0 text-white" size={18} /> Số 547 Nguyễn Văn Cừ, Bồ Đề, Hà Nội</a>
              <p className="flex items-center gap-4 hover:text-white transition-colors"><Phone className="shrink-0 text-white" size={18} /> <a href="tel:0917747777" className="text-xl font-medium tracking-wider">091.774.7777</a></p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}