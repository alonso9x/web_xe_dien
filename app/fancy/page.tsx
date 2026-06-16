'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import { ArrowLeft, Zap, BatteryCharging, ShieldCheck, Ruler, Gauge, Weight, Check, MapPin, Phone, Clock, MessageCircle } from "lucide-react";

// --- CUSTOM ICONS ---
const FacebookIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const ZaloIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.1 11.1c0-4.6-4.3-8.3-9.6-8.3-5.3 0-9.6 3.7-9.6 8.3 0 2.5 1.3 4.8 3.3 6.3-.2 1.4-1.3 3.3-1.3 3.3-.1.2 0 .5.3.6.1 0 .2.1.3.1 1.9-.8 3.9-1.8 3.9-1.8 1.1.3 2.3.4 3.5.4 5.3 0 9.6-3.7 9.6-8.3zm-12.7 3.2H6V12.7h2.8c.1 0 .2-.1.2-.2v-.8c0-.1-.1-.2-.2-.2H6.3V9.8h3.3c.1 0 .2-.1.2-.2V8.8c0-.1-.1-.2-.2-.2H4.9c-.5 0-.9.4-.9.9v4.7c0 .5.4.9.9.9h3.6v-1.1h-.1zM11.6 13h1.1v-4.1h-1.1V13zm3.4-3.1c-.6 0-1.1.5-1.1 1.1 0 .6.5 1.1 1.1 1.1.6 0 1.1-.5 1.1-1.1 0-.6-.5-1.1-1.1-1.1zm0 3.3c-1.1 0-2.1-.9-2.1-2.1 0-1.1.9-2.1 2.1-2.1 1.1 0 2.1.9 2.1 2.1 0 1.2-.9 2.1-2.1 2.1zm3.6-3.2H17.5V13h1.1V10z" />
  </svg>
);

const MessengerIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.14 2 11.25c0 2.91 1.5 5.5 3.94 7.22.18.13.3.34.3.56v2.45c0 .4.46.62.77.38l2.84-2.19c.2-.15.44-.21.68-.18 1.13.16 2.29.25 3.47.25 5.523 0 10-4.14 10-9.25S17.523 2 12 2zm1.09 12.35l-2.48-2.65c-.2-.22-.55-.26-.8-.09l-3.23 2.17c-.36.24-.8-.2-.55-.57l3.66-5.59c.2-.3.57-.38.88-.19l2.48 1.55c.2.13.45.1.62-.07l3.52-3.35c.34-.32.84.14.58.53l-3.8 5.76c-.2.31-.57.4-.88.2z"/>
  </svg>
);

const TiktokIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
    <path d="M15 8v8a4 4 0 0 1-4 4"></path>
    <path d="M15 4v4a4 4 0 0 0 4 4"></path>
  </svg>
);

const elegantFont = Plus_Jakarta_Sans({ 
  subsets: ["latin", "vietnamese"], 
  weight: ["300", "400", "500", "600"],
  display: "swap"
});

// --- DATA CHI TIẾT FANCY ---
const fancyData = {
  name: "Fancy",
  tagline: "Phong cách Italia",
  price: "17.990.000 VNĐ",
  signatureHex: "#4A5A75", // Tone Xanh Titan làm điểm nhấn
  description: "Đậm chất Ý, vươn tầm phong cách. Powelldd Fancy là sự pha trộn hoàn hảo giữa nét cổ điển thanh lịch và công nghệ hiện đại. Thiết kế vuốt cong tinh tế cùng khối động cơ 800W tối ưu, Fancy sẵn sàng đồng hành cùng bạn trên những con phố sầm uất với thần thái rạng rỡ và lôi cuốn nhất.",
  colors: [
    { name: "Đen", hex: "#1A1A1A", img: "/images/powelldd/fancy/den.png" },
    { name: "Trắng", hex: "#F4F4F4", img: "/images/powelldd/fancy/trang.png" },
    { name: "Xám Magic", hex: "#E5E7EB", img: "/images/powelldd/fancy/xam-magic.png" },
    { name: "Xám Urban", hex: "#9CA3AF", img: "/images/powelldd/fancy/xam-urban.png" },
    { name: "Xanh Titan", hex: "#4A5A75", img: "/images/powelldd/fancy/xanh-titan.png" }
  ],
  specs: [
    { icon: <Zap size={20} strokeWidth={1.5}/>, label: "Động cơ", value: "800W - Vận hành êm ái" },
    { icon: <BatteryCharging size={20} strokeWidth={1.5}/>, label: "Pin/Ắc quy", value: "60V-22.3Ah Graphene" },
    { icon: <Ruler size={20} strokeWidth={1.5}/>, label: "Quãng đường", value: "80 km / 1 lần sạc" },
    { icon: <Gauge size={20} strokeWidth={1.5}/>, label: "Vận tốc tối đa", value: "45 km/h" },
    { icon: <Weight size={20} strokeWidth={1.5}/>, label: "Tải trọng", value: "Lên đến 180 kg" },
    { icon: <ShieldCheck size={20} strokeWidth={1.5}/>, label: "Kháng nước", value: "Chuẩn IP67 an toàn tuyệt đối" }
  ]
};

// --- DANH SÁCH ẢNH TÍNH NĂNG FANCY ---
const featureImages = [
  "/images/vehicles/fancy/Fancy-anh-nen-01-1400x788.jpg",
  "/images/vehicles/fancy/Anh-nen-Fancy-02.jpg",
  "/images/vehicles/fancy/Fancy-anh-bia-03.jpg",
  "/images/vehicles/fancy/Anh-nen-Fancy-04.jpg",
  "/images/vehicles/fancy/Anh-nen-Fancy-06.jpg",
  "/images/vehicles/fancy/z7909875610747_3ed8e423c7829977f85b3d30afaa0547.jpg",
  "/images/vehicles/fancy/z7909878587756_75e42f65af2ee0984b5295cd28e943b9.jpg"
];

export default function FancyDetail() {
  const [activeColor, setActiveColor] = useState(fancyData.colors[0]);

  // HÀM XỬ LÝ VUỐT (SLIDE) ĐỔI MÀU
  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50; // Khoảng cách vuốt tối thiểu
    const currentIndex = fancyData.colors.findIndex(c => c.name === activeColor.name);

    if (info.offset.x < -swipeThreshold) {
      // Vuốt sang trái -> Sang ảnh tiếp theo
      const nextIndex = (currentIndex + 1) % fancyData.colors.length;
      setActiveColor(fancyData.colors[nextIndex]);
    } else if (info.offset.x > swipeThreshold) {
      // Vuốt sang phải -> Về ảnh trước đó
      const prevIndex = (currentIndex - 1 + fancyData.colors.length) % fancyData.colors.length;
      setActiveColor(fancyData.colors[prevIndex]);
    }
  };

  return (
    // Nền tổng thể: Slate 50 (Xám trắng pha chút xanh nhạt, cực kỳ sáng sủa)
    <main className={`min-h-screen bg-slate-50 text-slate-800 ${elegantFont.className} font-light selection:bg-slate-200 selection:text-slate-900`}>
      
      {/* HEADER LIGHT CINEMATIC */}
      <header className="fixed w-full top-0 bg-white/80 backdrop-blur-xl z-50 border-b border-slate-200 shadow-sm shadow-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold tracking-widest uppercase mt-0.5">Trở về</span>
          </Link>
          <div className="flex flex-col items-end">
            <h1 className="text-xl font-bold tracking-widest uppercase text-slate-800 leading-none">Minh Anh</h1>
            <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase mt-1">E-Scooter</span>
          </div>
        </div>
      </header>

      {/* HERO SECTION - LIGHT CINEMATIC LAYOUT */}
      <section className="pt-28 pb-20 px-6 max-w-7xl mx-auto min-h-[90vh] flex flex-col lg:flex-row items-center gap-16">
        {/* Khung ảnh xe bên trái */}
        <div className="w-full lg:w-3/5 relative">
          {/* Hào quang sáng thanh lịch phía sau */}
          <motion.div 
            animate={{ backgroundColor: activeColor.hex }}
            transition={{ duration: 0.8 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full opacity-15 blur-[80px] -z-10 mix-blend-multiply"
          ></motion.div>
          
          {/* Nền khung ảnh xe: Gradient Trắng sang Xám Titan nhạt */}
          <div className="w-full aspect-[4/3] lg:aspect-square bg-gradient-to-br from-white to-slate-100 rounded-[3rem] p-10 flex items-center justify-center border border-white shadow-2xl shadow-slate-200/60 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeColor.name}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                src={activeColor.img} 
                alt={`Xe điện Fancy màu ${activeColor.name}`} 
                className="w-full h-full object-contain drop-shadow-xl z-10 cursor-grab active:cursor-grabbing" // Thêm hiệu ứng con trỏ kéo thả
                drag="x" // Bật vuốt kéo thả ngang
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd} // Gọi hàm vuốt
              />
            </AnimatePresence>
            <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none">
              <span className="text-[120px] lg:text-[180px] font-bold text-slate-900/[0.03] tracking-tighter uppercase leading-none select-none">
                FANCY
              </span>
            </div>
          </div>

          {/* BẢNG CHỌN MÀU - CHỈ HIỂN THỊ TRÊN MOBILE (Dưới ảnh) */}
          <div className="mt-8 lg:hidden flex flex-col items-center justify-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">
              Màu sắc: <span className="text-slate-700">{activeColor.name}</span>
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {fancyData.colors.map((color) => (
                <button 
                  key={`mobile-${color.name}`}
                  onClick={() => setActiveColor(color)}
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm ${activeColor.name === color.name ? "ring-2 ring-offset-4 ring-offset-slate-50 ring-slate-400 scale-110" : "ring-1 ring-slate-300 hover:ring-slate-400 hover:scale-110"}`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {activeColor.name === color.name && (color.hex === "#F4F4F4" || color.hex === "#E5E7EB") && <Check size={20} className="text-slate-900 drop-shadow-sm" />}
                  {activeColor.name === color.name && color.hex !== "#F4F4F4" && color.hex !== "#E5E7EB" && <Check size={20} className="text-white drop-shadow-sm" />}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-4 italic font-medium">← Vuốt ảnh để xem màu khác →</p>
          </div>
        </div>

        {/* Khung thông tin bên phải */}
        <div className="w-full lg:w-2/5 flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-sm font-bold tracking-[0.2em] uppercase mb-3" style={{ color: fancyData.signatureHex }}>Powelldd E-Scooter</p>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter leading-none text-slate-900">{fancyData.name}</h1>
            <p className="text-xl md:text-2xl font-medium text-slate-500 mb-8 italic">{fancyData.tagline}</p>
            
            <p className="text-4xl font-bold tracking-tight text-slate-800 mb-10">{fancyData.price}</p>
            
            <p className="text-slate-600 text-sm leading-relaxed mb-10 font-medium text-justify">
              {fancyData.description}
            </p>

            {/* BẢNG CHỌN MÀU - CHỈ HIỂN THỊ TRÊN DESKTOP */}
            <div className="mb-12 hidden lg:block">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Màu sắc</p>
                <p className="text-xs font-bold text-slate-700">{activeColor.name}</p>
              </div>
              <div className="flex flex-wrap gap-4">
                {fancyData.colors.map((color) => (
                  <button 
                    key={`desktop-${color.name}`}
                    onClick={() => setActiveColor(color)}
                    className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm ${activeColor.name === color.name ? "ring-2 ring-offset-4 ring-offset-slate-50 ring-slate-400 scale-110" : "ring-1 ring-slate-300 hover:ring-slate-400 hover:scale-110"}`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {activeColor.name === color.name && (color.hex === "#F4F4F4" || color.hex === "#E5E7EB") && <Check size={20} className="text-slate-900 drop-shadow-sm" />}
                    {activeColor.name === color.name && color.hex !== "#F4F4F4" && color.hex !== "#E5E7EB" && <Check size={20} className="text-white drop-shadow-sm" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:0917747777" className="flex-1 bg-slate-800 text-white px-8 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-sm text-center hover:bg-slate-900 hover:scale-105 transition-all shadow-lg shadow-slate-900/20">
                Gọi Hotline
              </a>
              <a href="https://zalo.me/0917747777" target="_blank" rel="noreferrer" className="flex-1 bg-transparent border-2 border-slate-300 text-slate-700 px-8 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-sm text-center hover:bg-white hover:border-slate-400 transition-colors shadow-sm">
                Nhắn Zalo ngay
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CHÈN DANH SÁCH ẢNH TÍNH NĂNG (Màu sắc trong trẻo, điện ảnh nhẹ nhàng) */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col gap-12">
          {featureImages.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="w-full rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-500 border-4 border-white"
            >
              <img 
                src={src} 
                alt={`Tính năng Fancy ${index + 1}`} 
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-1000 filter saturate-[0.95] contrast-[1.05]" 
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* THÔNG SỐ KỸ THUẬT */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-widest mb-4 text-slate-800">Thông số <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-[#4A5A75]">Kỹ thuật</span></h2>
            <div className="w-16 h-1 bg-slate-300 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fancyData.specs.map((spec, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex items-start gap-5 hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-500 group-hover:bg-[#4A5A75] group-hover:text-white transition-all shrink-0 shadow-sm border border-slate-200">
                  {spec.icon}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">{spec.label}</p>
                  <p className="text-lg font-bold text-slate-700">{spec.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOWROOM & GOOGLE MAPS */}
      <section id="showroom" className="py-24 bg-[#F4F4F6] border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-8">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <span className="text-xs font-semibold tracking-[0.3em] uppercase text-neutral-400 block mb-3">Ghé thăm chúng tôi</span>
                <h3 className="text-3xl md:text-4xl font-semibold uppercase tracking-widest text-black mb-6">SHOWROOM <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-neutral-600 to-neutral-400 font-light italic">MINH ANH</span></h3>
                <p className="text-neutral-500 font-light leading-relaxed mb-8">Không gian trưng bày hiện đại, đầy đủ các phiên bản và màu sắc mới nhất của Powelldd E-Scooter. Kính mời anh/chị đến trải nghiệm thực tế và lái thử xe trực tiếp.</p>
              </motion.div>

              <div className="space-y-6 text-neutral-700 font-light text-sm">
                <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-neutral-100 shadow-sm">
                  <MapPin className="shrink-0 text-black mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold text-black uppercase tracking-wider text-xs mb-1">Địa chỉ</p>
                    <a href="https://www.google.com/maps/search/?api=1&query=547+Nguyễn+Văn+Cừ,+Bồ+Đề,+Long+Biên,+Hà+Nội" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">
                      Số 547 Nguyễn Văn Cừ, Bồ Đề, Long Biên, Hà Nội
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-neutral-100 shadow-sm">
                  <Phone className="shrink-0 text-black mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold text-black uppercase tracking-wider text-xs mb-1">Hotline tư vấn</p>
                    <a href="tel:0917747777" className="text-lg font-medium tracking-wider text-black hover:underline">091.774.7777</a>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-neutral-100 shadow-sm">
                  <Clock className="shrink-0 text-black mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold text-black uppercase tracking-wider text-xs mb-1">Thời gian mở cửa</p>
                    <p>08:00 - 21:00 (Thứ 2 - Chủ Nhật)</p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="lg:col-span-7 w-full h-[450px] rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl shadow-neutral-200/80 relative">
              <iframe src="https://maps.google.com/maps?q=547%20Nguy%E1%BB%85n%20V%C4%83n%20C%E1%BB%AB,%20B%E1%BB%93%20%C4%90%E1%BB%81,%20Long%20Bi%C3%AAn,%20H%C3%A0%20N%E1%BB%99i&t=&z=16&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style={{ border: 0 }} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 w-full h-full object-cover"></iframe>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER ĐÃ CẬP NHẬT TỪ HOME */}
      <footer id="lien-he" className="bg-black text-white pt-24 pb-10 px-6 border-t-8 border-neutral-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 border-b border-neutral-800 pb-16 mb-8">
          <div className="lg:col-span-5">
            <h2 className="text-4xl font-semibold mb-4 uppercase tracking-widest leading-none">Minh Anh</h2>
            <span className="text-sm text-neutral-500 tracking-[0.4em] uppercase block mb-6">E-Scooter</span>
            <p className="text-neutral-400 text-sm leading-relaxed font-light max-w-sm mb-8">Nâng tầm phong cách di chuyển đô thị. Đại lý ủy quyền chính hãng Powelldd hàng đầu Việt Nam.</p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/profile.php?id=61585209534176" target="_blank" rel="noreferrer" className="bg-neutral-800 p-3 rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                <FacebookIcon size={20} />
              </a>
              <a href="https://zalo.me/0917747777" target="_blank" rel="noreferrer" className="bg-neutral-800 p-3 rounded-full hover:bg-blue-500 transition-all shadow-sm flex items-center justify-center">
                <img src="/images/logo-zalo-tiktok-facebook/logo-zalo-footer.png" alt="Zalo" className="w-5 h-5 object-contain rounded-full" />
              </a>
              <a href="https://www.tiktok.com/@powelldd.long.bien" target="_blank" rel="noreferrer" className="bg-neutral-800 p-3 rounded-full hover:bg-gray-700 hover:text-white transition-all shadow-sm">
                <TiktokIcon size={20} />
              </a>
            </div>
          </div>
          <div className="lg:col-span-4">
            <h3 className="text-sm font-semibold mb-8 uppercase tracking-[0.2em] text-neutral-200">Trải nghiệm thực tế</h3>
            <div className="space-y-6 text-neutral-400 font-light text-sm">
              <a href="https://www.google.com/maps/search/?api=1&query=547+Nguyễn+Văn+Cừ,+Bồ+Đề,+Hà+Nội" target="_blank" rel="noreferrer" className="flex items-start gap-4 hover:text-white transition-colors">
                <MapPin className="shrink-0 text-white" size={18} /> Số 547 Nguyễn Văn Cừ, Bồ Đề, Hà Nội
              </a>
              <p className="flex items-center gap-4 hover:text-white transition-colors"><Phone className="shrink-0 text-white" size={18} /> <a href="tel:0917747777" className="text-xl font-medium tracking-wider">091.774.7777</a></p>
              <p className="flex items-center gap-4 hover:text-white transition-colors"><Clock className="shrink-0 text-white" size={18} /> 08:00 - 21:00 (Thứ 2 - Chủ Nhật)</p>
            </div>
          </div>
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold mb-8 uppercase tracking-[0.2em] text-neutral-200">Dịch vụ</h3>
            <ul className="space-y-4 font-medium text-sm text-neutral-400">
              <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo hành</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hướng dẫn trả góp</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-neutral-500 text-[10px] font-medium uppercase tracking-[0.2em]">
          <p>© 2026 MINH ANH E-SCOOTER. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>

      {/* CỤM NÚT LIÊN HỆ NỔI (KÈM MESSENGER TỪ HOME) */}
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