'use client';

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function ImageSlider({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false); // Trạng thái mở Popup
  const [isHovered, setIsHovered] = useState(false);

  const handleNext = useCallback(() => setCurrentIndex((prev) => (prev + 1) % images.length), [images.length]);
  const handlePrev = useCallback(() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length), [images.length]);

  // Tự động chuyển ảnh (dừng khi di chuột vào hoặc khi đang mở Popup)
  useEffect(() => {
    if (isLightboxOpen || isHovered) return;
    const timer = setInterval(handleNext, 4000);
    return () => clearInterval(timer);
  }, [handleNext, isLightboxOpen, isHovered]);

  // Hỗ trợ bấm phím mũi tên và Esc trên bàn phím máy tính
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, handleNext, handlePrev]);

  // Xử lý vuốt ảnh
  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) handleNext();
    else if (info.offset.x > swipeThreshold) handlePrev();
  };

  if (!images || images.length === 0) return null;

  return (
    <>
      {/* 1. SLIDER CHÍNH TRÊN TRANG (THU NHỎ) */}
      <div 
        className="relative w-full max-w-5xl mx-auto aspect-[16/9] md:aspect-[21/9] rounded-[2rem] overflow-hidden group shadow-xl border-2 border-amber-100 bg-neutral-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Album ảnh ${currentIndex + 1}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            onClick={() => setIsLightboxOpen(true)} // Bấm vào là bật Popup
          />
        </AnimatePresence>

        {/* Nút điều hướng Slider thường */}
        <button 
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/60 hover:bg-white backdrop-blur-md text-amber-900 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10 shadow-md"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/60 hover:bg-white backdrop-blur-md text-amber-900 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10 shadow-md"
        >
          <ChevronRight size={24} />
        </button>

        {/* Chấm tròn báo vị trí */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
          {images.map((_, idx) => (
            <button
              key={`dot-${idx}`}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
              className={`w-2 h-2 rounded-full transition-all shadow-sm ${
                currentIndex === idx ? "bg-amber-400 w-6" : "bg-white/70 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 2. POPUP LIGHTBOX PHÓNG TO (FULL MÀN HÌNH) */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md"
          >
            {/* Nút Đóng (X) */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 bg-white/10 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors z-[10000]"
            >
              <X size={28} />
            </button>

            {/* Nút Prev Popup */}
            <button 
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors z-[10000]"
            >
              <ChevronLeft size={32} />
            </button>

            {/* Khu vực ảnh Popup */}
            <div 
              className="w-full h-full max-w-7xl max-h-[90vh] p-4 relative flex items-center justify-center"
              onClick={() => setIsLightboxOpen(false)} // Bấm ra ngoài khoảng đen để đóng
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={`lightbox-${currentIndex}`}
                  src={images[currentIndex]}
                  alt={`Album ảnh phóng to ${currentIndex + 1}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-contain cursor-grab active:cursor-grabbing select-none"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.8}
                  onDragEnd={handleDragEnd}
                  onClick={(e) => e.stopPropagation()} // Chặn đóng khi vô tình bấm vào giữa ảnh
                />
              </AnimatePresence>
            </div>

            {/* Nút Next Popup */}
            <button 
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors z-[10000]"
            >
              <ChevronRight size={32} />
            </button>

            {/* Bộ đếm ảnh (Ví dụ: 1/10) */}
            <div className="absolute top-6 left-6 text-white/70 font-medium tracking-widest bg-white/10 px-4 py-2 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}