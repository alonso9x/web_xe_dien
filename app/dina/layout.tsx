import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xe Điện Dina | Xe Điện Minh Anh",
  description: "Khám phá xe máy điện Powelldd Dina thiết kế thanh lịch, màu hồng Blush cá tính. Trải nghiệm ngay tại Xe Điện Long Biên - Minh Anh.",
  alternates: {
    canonical: "https://xedienminhanh.vn/dina",
  },
};

export default function DinaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Xe máy điện Powelldd Dina",
    "image": "https://xedienminhanh.vn/images/powelldd/dina/hong-blush.png",
    "description": "Khám phá xe máy điện Powelldd Dina thiết kế thanh lịch, màu hồng Blush cá tính. Trải nghiệm ngay tại Xe Điện Minh Anh.",
    "sku": "POWELLDD-DINA",
    "brand": {
      "@type": "Brand",
      "name": "Powelldd"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://xedienminhanh.vn/dina",
      "priceCurrency": "VND",
      "price": "14490000",
      "priceValidUntil": "2026-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Xe Điện Minh Anh"
      }
    }
  };

  return (
    <>
      {/* NHÚNG SCHEMA VÀO ĐẦU TRANG */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {/* RENDER NỘI DUNG GIAO DIỆN BÊN DƯỚI */}
      {children}
    </>
  );
}