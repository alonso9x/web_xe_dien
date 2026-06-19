'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, Variants } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
// Đã bổ sung thêm icon Menu ở đây
import { Zap, ShieldCheck, BatteryCharging, Leaf, Star, ArrowRight, MapPin, Phone, Clock, MessageCircle, X, CheckCircle2, Loader2, Menu } from "lucide-react";

// --- CUSTOM ICONS ---
const FacebookIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const MessengerIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.14 2 11.25c0 2.91 1.5 5.5 3.94 7.22.18.13.3.34.3.56v2.45c0 .4.46.62.77.38l2.84-2.19c.2-.15.44-.21.68-.18 1.13.16 2.29.25 3.47.25 5.523 0 10-4.14 10-9.25S17.523 2 12 2zm1.09 12.35l-2.48-2.65c-.2-.22-.55-.26-.8-.09l-3.23 2.17c-.36.24-.8-.2-.55-.57l3.66-5.59c.2-.3.57-.38.88-.19l2.48 1.55c.2.13.45.1.62-.07l3.52-3.35c.34-.32.84.14.58.53l-3.8 5.76c-.2.31-.57.4-.88.2z"/></svg>
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
  weight: ["300", "400", "500", "600", "700"],
  display: "swap"
});

const powellddBikes = [
  { id: "wespan-pro", name: "Wespan pro", price: "20.500.000 VNĐ", range: "70 km", speed: "47 km/h", colors: ["Đen", "Trắng", "Vàng"], tagline: "Thiết kế vượt thời gian", coverImage: "/images/powelldd/wespan-pro/xam-bac-khi.png", signatureHex: "#D97706", category: "cao-cap" },
  { id: "dimoon", name: "Dimoon", price: "18.990.000 VNĐ", range: "90 km", speed: "48 km/h", colors: ["Đen vũ trụ", "Trắng", "Xanh titan"], tagline: "Biểu tượng thời thượng mới", coverImage: "/images/powelldd/dimoon/trang-bang-suong.png", signatureHex: "#1E3A8A", category: "cao-cap" },
  { id: "walkmen", name: "Walkmen", price: "13.800.000 VNĐ", range: "60 km", speed: "37 km/h", colors: ["Đen", "Trắng", "Vàng"], tagline: "Tự do không sợ hãi", coverImage: "/images/powelldd/walkmen/trang-storm.png", signatureHex: "#EA580C", category: "tieu-chuan" },
  { id: "shine", name: "Shine", price: "14.990.000 VNĐ", range: "60 km", speed: "37 km/h", colors: ["Cam đỏ", "Đen", "Hồng"], tagline: "Shine - Go to school", coverImage: "/images/powelldd/shine/trang-hong.png", signatureHex: "#0D9488", category: "tieu-chuan" },
  { id: "fancy", name: "Fancy", price: "17.990.000 VNĐ", range: "80 km", speed: "45 km/h", colors: ["Đen", "Trắng", "Xám"], tagline: "Phong cách Italia", coverImage: "/images/powelldd/fancy/den.png", signatureHex: "#DC2626", category: "cao-cap" },
  { id: "hazel", name: "Hazel", price: "14.990.000 VNĐ", range: "70 km", speed: "37 km/h", colors: ["Hồng", "Trắng", "Xanh"], tagline: "Ngọt ngào tỏa sáng", coverImage: "/images/powelldd/hazel/hong-dao.png", signatureHex: "#DB2777", category: "tieu-chuan" },
  { id: "sweetea", name: "Sweetea", price: "13.800.000 VNĐ", range: "70 km", speed: "35 km/h", colors: ["Kem", "Vàng", "Xám"], tagline: "Thanh xuân ngọt ngào", coverImage: "/images/powelldd/sweetea/kem-tra-sua.png", signatureHex: "#B45309", category: "tieu-chuan" }
];

const techSlides = [
  { img: "/images/cong-nghe/ac-quy.jpg", title: "Hệ thống thu hồi năng lượng thông minh", desc: "Chuyển hóa động năng thành điện năng | Tự động sạc khi trượt, xuống dốc, phanh | Gia tăng quãng đường di chuyển." },
  { img: "/images/cong-nghe/dong-co.jpg", title: "Đột phá vượt bậc trong phát triển động cơ", desc: "Tối ưu hiệu suất | Giảm thiểu tiếng ồn | Tin cậy tuyệt đối." },
  { img: "/images/cong-nghe/bo-dieu-khien.jpg", title: "Mang đến trải nghiệm lái an toàn và mạnh mẽ", desc: "Kết cấu ổn định vượt trội | Chiến lược điều khiển tiên tiến | Khả năng điều khiển chính xác | Tầm hoạt động xa hơn | Khả năng tương thích hoàn hảo." },
  { img: "/images/cong-nghe/lop-khang-luc.jpg", title: "Tối đa hóa quãng đường di chuyển", desc: "Đèn chiếu sáng led tiêu thụ ít điện năng | Lốp giảm kháng lực lăn | Thiết kế tối ưu khí động học | Dây dẫn điện trở thấp." }
];

const fadeUp: Variants = { hidden: { opacity: 0, y: 50 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } };
const stagger: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.2 } } };

export default function Home() {
  const [filter, setFilter] = useState("all");
  const filteredBikes = powellddBikes.filter(bike => filter === "all" ? true : bike.category === filter);

  const [isModalOpen, setIsModalOpen] = useState(false);
  // Thêm state để quản lý Menu Mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [formStatus, setFormStatus] = useState("idle");
  const [formData, setFormData] = useState({ name: "", phone: "", model: "Chưa xác định", note: "" });

  const bannerImages = [
    "/images/banner/banner-1.png",
    "/images/banner/banner-2.png",
    "/images/banner/banner-3.png",
    "/images/banner/png.jpg" 
  ];
  const [currentBanner, setCurrentBanner] = useState(0);
  const [currentTech, setCurrentTech] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentBanner((prev) => (prev === bannerImages.length - 1 ? 0 : prev + 1));
    }, 5000); 
    return () => clearInterval(slideInterval);
  }, [bannerImages.length]);

  useEffect(() => {
    const techInterval = setInterval(() => {
      setCurrentTech((prev) => (prev === techSlides.length - 1 ? 0 : prev + 1));
    }, 4000); 
    return () => clearInterval(techInterval);
  }, []);

  const { scrollY } = useScroll();
  const yHeroBg = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacityHeroText = useTransform(scrollY, [0, 500], [1, 0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    const scriptURL = "https://script.google.com/macros/s/AKfycbzb2G1ttnSb-J3xmO6dNoRrmVWFIXf3iLo00Sf8H_NGkSyvujAvbrZfGfBjvvqNNAhH/exec"; 
    try {
      await fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "text/plain;charset=utf-8" },
      });
      setFormStatus("success");
      setTimeout(() => {
        setIsModalOpen(false);
        setFormStatus("idle");
        setFormData({ name: "", phone: "", model: "Chưa xác định", note: "" });
      }, 3000);
    } catch (error) {
      console.error("Lỗi gửi form:", error);
      setFormStatus("error");
    }
  };

  return (
    <main className={`min-h-screen bg-[#F4F4F6] text-neutral-800 ${elegantFont.className} overflow-x-hidden font-light relative`}>
      
      {/* 1. HEADER */}
      <motion.header initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.8 }} className="fixed w-full top-0 bg-white/70 backdrop-blur-2xl z-50 border-b border-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col cursor-pointer">
            <h1 className="text-2xl font-semibold tracking-widest uppercase text-black leading-none">Minh Anh</h1>
            <span className="text-[10px] font-medium tracking-widest text-neutral-500 uppercase mt-1">E-Scooter</span>
          </motion.div>
          
          <nav className="hidden lg:flex gap-10 text-[13px] font-semibold uppercase tracking-widest text-neutral-600">
            <Link href="/" className="hover:text-black transition-colors">Trang chủ</Link>
            <Link href="/#san-pham" className="hover:text-black transition-colors">Sản phẩm</Link>
            <Link href="/#cong-nghe" className="hover:text-black transition-colors">Công nghệ</Link>
            <Link href="/tin-tuc" className="hover:text-black transition-colors">Tin tức</Link>
          </nav>

          {/* Nút Hamburger cho Mobile */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden text-black p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <Menu size={28} />
          </button>

          <motion.button onClick={() => setIsModalOpen(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden md:flex items-center gap-2 bg-black text-white px-7 py-3 rounded-full text-sm font-semibold shadow-xl shadow-black/20">
            Nhận tư vấn <ArrowRight size={16} />
          </motion.button>
        </div>
      </motion.header>

      {/* TÍCH HỢP MENU MOBILE DẠNG DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Lớp mờ nền */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-[998] lg:hidden backdrop-blur-sm"
            />
            
            {/* Khung Menu trượt từ phải */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white z-[999] shadow-2xl flex flex-col lg:hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-neutral-100">
                <span className="text-lg font-semibold tracking-widest uppercase text-black">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-neutral-100 rounded-full text-black hover:bg-neutral-200 transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex flex-col p-6 gap-6 text-sm font-semibold uppercase tracking-widest text-neutral-600">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black transition-colors pb-4 border-b border-neutral-50">Trang chủ</Link>
                <Link href="/#san-pham" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black transition-colors pb-4 border-b border-neutral-50">Sản phẩm</Link>
                <Link href="/#cong-nghe" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black transition-colors pb-4 border-b border-neutral-50">Công nghệ</Link>
                <Link href="/tin-tuc" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black transition-colors pb-4 border-b border-neutral-50">Tin tức</Link>
              </div>

              <div className="mt-auto p-6">
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); setIsModalOpen(true); }} 
                  className="w-full flex justify-center items-center gap-2 bg-black text-white px-7 py-4 rounded-full text-sm font-semibold shadow-xl shadow-black/20 hover:bg-red-600 transition-colors"
                >
                  Nhận tư vấn ngay <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 2. HERO SECTION */}
      <section className="relative w-full h-[100svh] flex items-center justify-center bg-black overflow-hidden">
        <motion.div style={{ y: yHeroBg }} className="absolute inset-0 z-0 mt-[72px]">
          <AnimatePresence mode="popLayout">
            <motion.img 
              key={currentBanner}
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              src={bannerImages[currentBanner]} alt={`Banner ${currentBanner + 1}`} 
              className="w-full h-full object-cover scale-105 absolute top-0 left-0" 
              onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070&auto=format&fit=crop"; }} 
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-[#F4F4F6] via-black/50 to-transparent z-10"></div>
        </motion.div>
        
        <motion.div style={{ opacity: opacityHeroText }} variants={stagger} initial="hidden" animate="show" className="relative z-20 text-center text-white px-4 max-w-5xl mt-20">
          <motion.div variants={fadeUp} className="inline-block px-4 py-1.5 rounded-full border border-white/30 backdrop-blur-md mb-6">
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-neutral-200">Kỷ nguyên di chuyển xanh</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-semibold mb-6 tracking-tighter leading-[1.1] drop-shadow-2xl">
            ĐỊNH HÌNH <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-300 to-neutral-500 italic font-light pr-2">PHONG CÁCH SỐNG</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg md:text-xl font-light mb-12 text-neutral-300 drop-shadow-lg tracking-wide max-w-2xl mx-auto">
            Hệ thống phân phối các dòng xe máy điện Powelldd, TMT, Vinfast....chính hãng hàng đầu Việt Nam.
          </motion.p>
          <motion.a variants={fadeUp} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="#san-pham" className="inline-flex items-center gap-3 bg-white text-black px-12 py-5 rounded-full font-semibold text-sm uppercase tracking-widest shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            Khám phá ngay <ArrowRight size={18} />
          </motion.a>
        </motion.div>
      </section>

      {/* 3. SCROLLING TICKER */}
      <div className="w-full bg-black py-4 border-y border-neutral-800 overflow-hidden flex whitespace-nowrap">
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ ease: "linear", duration: 35, repeat: Infinity }} className="flex text-white font-semibold text-sm tracking-[0.2em] uppercase">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="mx-8 flex items-center gap-8">
              BẢO HÀNH 2 NĂM <span className="w-2 h-2 rounded-full bg-neutral-600"></span>
              TRẢ GÓP 0% <span className="w-2 h-2 rounded-full bg-neutral-600"></span>
              GIAO XE TẬN NƠI <span className="w-2 h-2 rounded-full bg-neutral-600"></span>
              THU CŨ ĐỔI MỚI <span className="w-2 h-2 rounded-full bg-neutral-600"></span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* 4. DANH SÁCH SẢN PHẨM */}
      <section id="san-pham" className="max-w-7xl mx-auto px-6 pb-20 pt-24">
        <div className="mb-16 text-center flex flex-col items-center">
          <h3 className="text-4xl md:text-5xl font-semibold uppercase mb-6 tracking-widest">Bộ sưu tập <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-neutral-400 font-light italic">Powelldd</span></h3>
          <div className="flex bg-white p-2 rounded-full shadow-sm border border-neutral-100 mt-4">
            <button onClick={() => setFilter("all")} className={`px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-[0.1em] transition-all ${filter === "all" ? "bg-black text-white" : "text-neutral-500 hover:bg-neutral-50"}`}>Tất cả</button>
            <button onClick={() => setFilter("cao-cap")} className={`px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-[0.1em] transition-all ${filter === "cao-cap" ? "bg-black text-white" : "text-neutral-500 hover:bg-neutral-50"}`}>Cao Cấp</button>
            <button onClick={() => setFilter("tieu-chuan")} className={`px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-[0.1em] transition-all ${filter === "tieu-chuan" ? "bg-black text-white" : "text-neutral-500 hover:bg-neutral-50"}`}>Tiêu Chuẩn</button>
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence>
            {filteredBikes.map((bike) => (
              <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5 }} key={bike.id} whileHover={{ y: -15 }} className="group bg-white rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl hover:shadow-neutral-200/50 transition-all border border-neutral-100 flex flex-col cursor-pointer relative overflow-hidden">
                {(bike.id === "dimoon" || bike.id === "wespan-pro" || bike.id === "shine") && (
                  <div className="absolute top-0 right-10 z-30 filter drop-shadow-md">
                    <div className="bg-gradient-to-b from-red-500 to-red-700 w-11 h-14 flex flex-col items-center pt-2.5 [clip-path:polygon(0_0,100%_0,100%_100%,50%_85%,0_100%)]">
                      <div className="w-1.5 h-1.5 bg-white/40 rounded-full shadow-inner mb-1"></div>
                      <span className="text-white text-[10px] font-bold uppercase tracking-widest">Hot</span>
                    </div>
                  </div>
                )}
                <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-10 blur-3xl group-hover:opacity-40 transition-opacity duration-700" style={{ backgroundColor: bike.signatureHex }}></div>
                <div className="relative w-full aspect-[4/3] bg-neutral-50 rounded-3xl mb-8 overflow-hidden flex items-center justify-center">
                  <motion.img whileHover={{ scale: 1.1, rotate: 2 }} transition={{ duration: 0.7 }} src={bike.coverImage} alt={bike.name} className="w-full h-full object-contain p-6 drop-shadow-xl z-10" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-black px-4 py-2 rounded-full text-xs font-semibold tracking-widest shadow-sm z-20">{bike.price}</div>
                </div>
                <div className="px-2">
                  <h4 className="text-2xl font-semibold mb-1 tracking-wide" style={{ color: bike.signatureHex }}>{bike.name}</h4>
                  <p className="text-neutral-500 text-xs mb-6 font-medium italic">{bike.tagline}</p>
                  <div className="flex justify-between items-center bg-[#F8F8F8] p-4 rounded-2xl mb-8 border border-neutral-50">
                    <div className="text-center w-full">
                      <p className="text-[9px] text-neutral-400 font-medium mb-1 tracking-widest uppercase">Quãng đường</p>
                      <p className="font-semibold text-lg">{bike.range}</p>
                    </div>
                    <div className="w-px h-8 bg-neutral-200 mx-2"></div>
                    <div className="text-center w-full">
                      <p className="text-[9px] text-neutral-400 font-medium mb-1 tracking-widest uppercase">Vận tốc</p>
                      <p className="font-semibold text-lg">{bike.speed}</p>
                    </div>
                  </div>
                </div>
                <Link href={`/${bike.id}`} style={{ backgroundColor: bike.signatureHex }} className="w-full block text-center text-white py-4 rounded-2xl font-medium text-sm uppercase tracking-widest shadow-md mt-auto hover:opacity-90 transition-opacity">Xem chi tiết</Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* 5. CÔNG NGHỆ - 3D COVERFLOW SLIDER */}
      <section id="cong-nghe" className="py-24 bg-white border-y border-neutral-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 text-center flex flex-col items-center">
            <h3 className="text-4xl md:text-5xl font-semibold uppercase mb-4 tracking-widest text-black">
              Công nghệ
            </h3>
            <div className="w-16 h-1 bg-red-600 mx-auto rounded-full"></div>
          </div>

          <div className="relative h-[500px] w-full flex justify-center items-center perspective-1000">
            <AnimatePresence initial={false}>
              {techSlides.map((slide, index) => {
                const diff = (index - currentTech + techSlides.length) % techSlides.length;
                let x = "0%";
                let scale = 0.5;
                let opacity = 0;
                let zIndex = 0;

                if (diff === 0) { 
                  x = "0%"; scale = 1.1; opacity = 1; zIndex = 20; 
                } else if (diff === 1) { 
                  x = "115%"; scale = 0.75; opacity = 0.4; zIndex = 10; 
                } else if (diff === techSlides.length - 1) { 
                  x = "-115%"; scale = 0.75; opacity = 0.4; zIndex = 10; 
                }

                return (
                  <motion.div
                    key={index}
                    animate={{ x, scale, opacity, zIndex }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute w-[90%] max-w-[320px] md:max-w-[420px] flex flex-col items-center text-center cursor-pointer"
                    onClick={() => setCurrentTech(index)}
                  >
                    <div className="w-full h-[220px] md:h-[260px] mb-6 flex items-center justify-center">
                      <img 
                        src={slide.img} 
                        alt={slide.title} 
                        className={`max-w-full max-h-full object-contain mix-blend-multiply transition-all duration-500 ${diff === 0 ? 'drop-shadow-2xl scale-105' : 'drop-shadow-none grayscale-[20%]'}`} 
                      />
                    </div>

                    <div className={`px-2 transition-all duration-500 flex flex-col items-center justify-start h-28 ${diff === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <p className="text-sm md:text-lg font-bold text-black mb-3">{slide.title}</p>
                      <p className="text-xs md:text-sm text-neutral-500 leading-relaxed font-medium">
                        {slide.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-3 mt-4">
            {techSlides.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setCurrentTech(idx)}
                className={`h-2.5 rounded-full transition-all duration-500 ${currentTech === idx ? 'bg-red-700 w-10' : 'bg-neutral-300 w-2.5 hover:bg-neutral-400'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-32 bg-black text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h3 className="text-4xl md:text-5xl font-semibold uppercase mb-16 text-center tracking-widest">Khách hàng <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 font-light italic">nói gì?</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Anh Tuấn", bike: "Dimoon", text: "Thiết kế xe tinh tế, chạy êm ru ngoài phố cổ. Mình chạy cả tuần mới phải sạc 1 lần, rất ưng ý dịch vụ tại Minh Anh." },
              { name: "Chị Hạnh", bike: "Hazel", text: "Mua cho con gái đi học, màu hồng ngoài đời nhìn sang hơn trong ảnh. Xe nhẹ, dễ dắt, phanh an toàn. Chấm 10 điểm!" },
              { name: "Bạn Đức", bike: "Wespan pro", text: "Thích form dáng cổ điển này từ lâu, qua showroom chạy thử phát là chốt cọc luôn. Giá cả hợp lý so với chất lượng hoàn thiện." }
            ].map((review, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.2 }} viewport={{ once: true }} className="bg-neutral-900 p-10 rounded-[2rem] border border-neutral-800">
                <div className="flex gap-1 text-yellow-400 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-neutral-300 text-sm leading-relaxed mb-8 italic font-light">"{review.text}"</p>
                <div>
                  <p className="font-semibold text-lg">{review.name}</p>
                  <p className="text-neutral-500 text-xs font-medium uppercase tracking-[0.2em] mt-1">Đã mua {review.bike}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA & NÚT MỞ MODAL */}
      <section className="py-32 bg-white text-black text-center px-6 border-b border-neutral-100">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-semibold mb-8 tracking-widest uppercase flex flex-col gap-y-4 md:gap-y-6">
            <span>TRẢI NGHIỆM</span>
            <span>ĐẲNG CẤP</span>
          </h2>
          <p className="text-lg font-light mb-12 text-neutral-500">Đến ngay showroom hoặc để lại số điện thoại để nhận voucher ưu đãi lên đến 2 triệu đồng.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-black text-white px-12 py-4 rounded-full font-medium uppercase tracking-[0.2em] text-sm hover:scale-105 transition-transform shadow-lg"
            >
              Đăng ký lái thử
            </button>
            <a href="tel:0917747777" className="inline-flex items-center justify-center bg-transparent border border-black text-black px-12 py-4 rounded-full font-medium uppercase tracking-[0.2em] text-sm hover:bg-neutral-50 transition-colors">
              Gọi Hotline ngay
            </a>
          </div>
        </motion.div>
      </section>

      {/* 8. SHOWROOM & GOOGLE MAPS */}
      <section id="showroom" className="py-24 bg-[#F4F4F6] border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-8">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <span className="text-xs font-semibold tracking-[0.3em] uppercase text-neutral-400 block mb-3">Ghé thăm chúng tôi</span>
                <h3 className="text-3xl md:text-4xl font-semibold uppercase tracking-widest text-black mb-6">SHOWROOM <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-neutral-600 to-neutral-400 font-light italic">MINH ANH</span></h3>
                <p className="text-neutral-500 font-light leading-relaxed mb-8">Không gian trưng bày hiện đại, đầy đủ các phiên bản và màu sắc mới nhất của Powelldd, TMT, Vinfast.... Kính mời quý khách đến trải nghiệm thực tế và lái thử xe trực tiếp.</p>
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

      {/* 9. FOOTER */}
      <footer id="lien-he" className="bg-black text-white pt-24 pb-10 px-6 border-t-8 border-neutral-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 border-b border-neutral-800 pb-16 mb-8">
          <div className="lg:col-span-5">
            <h2 className="text-4xl font-semibold mb-4 uppercase tracking-widest leading-none">Minh Anh</h2>
            <span className="text-sm text-neutral-500 tracking-[0.4em] uppercase block mb-6">E-Scooter</span>
            <p className="text-neutral-400 text-sm leading-relaxed font-light max-w-sm mb-8">Nâng tầm phong cách di chuyển đô thị. Hệ thống phân phối các dòng xe điện Powelldd, TMT, Vinfast....chính hãng hàng đầu Việt Nam.</p>
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

      {/* --- CỤM NÚT LIÊN HỆ NỔI (KÈM MESSENGER) --- */}
      <div className="fixed bottom-6 right-6 z-[900] flex flex-col gap-5">
        <div className="relative w-14 h-14 group">
          <span className="absolute inset-0 rounded-full bg-[#0068FF] animate-ping opacity-60 group-hover:opacity-0 transition-opacity duration-300"></span>
          <motion.a href="https://zalo.me/0917747777" target="_blank" rel="noreferrer" animate={{ rotate: [0, -15, 15, -15, 15, 0, 0, 0, 0, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0 }} className="relative flex items-center justify-center w-full h-full rounded-full shadow-xl shadow-[#0068FF]/50 hover:scale-110 transition-transform overflow-hidden bg-white">
            <img src="/images/logo-zalo-tiktok-facebook/logo-zalo.png" alt="Zalo" className="w-8 h-8 object-contain" />
          </motion.a>
        </div>
      </div>
    </main>
  );
}