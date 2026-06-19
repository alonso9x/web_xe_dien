'use client';
import { useState } from 'react';

export default function FallbackImage({ src, alt, className }: { src: string, alt: string, className?: string }) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img 
      src={imgSrc ? imgSrc : '/images/default-news.jpg'} 
      alt={alt} 
      className={className}
      onError={() => {
        // Hễ link gốc chết, tự động bẻ lái sang ảnh mặc định
        setImgSrc('/images/default-news.jpg');
      }}
    />
  );
}