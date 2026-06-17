import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ 
  subsets: ["latin", "vietnamese"], 
  weight: ["400", "500", "700", "900"],
  display: "swap"
});

// BỘ TỪ KHÓA VÀ THÔNG TIN CHUẨN SEO
export const metadata: Metadata = {
  title: "Xe Điện Minh Anh | Đại Lý Phân Phối Powelldd Chính Hãng",
  description: "Hệ thống phân phối Minh Anh chuyên phân phối các dòng xe máy điện, xe đạp điện, xe trợ lực điện với các thương hiệu Powelldd, TMT, Vinfast....",
  keywords: "xe điện minh anh, xe điện học sinh, xe máy điện hà nội, xe điện Long Biên",
  openGraph: {
    title: "Xe Điện Minh Anh | Phong Cách Di Chuyển Mới",
    description: "Trải nghiệm các mẫu xe điện Neo-Retro đỉnh cao tại 547 Nguyễn Văn Cừ.",
    url: "https://xedienminhanh.vn", 
    siteName: "Xe Điện Minh Anh",
    images: [
      {
        url: "/images/banner/banner-3.png", // Ảnh hiển thị khi anh share link qua Zalo, Facebook
        width: 1200,
        height: 630,
        alt: "Hệ thống phân phối Xe Điện Minh Anh",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}