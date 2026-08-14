import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xe Điện Dimoon | Xe Điện Minh Anh",
  description: "Khám phá xe máy điện Powelldd Dimoon với công nghệ AI tuyệt đỉnh, 100km cho một lần sạc. Trải nghiệm ngay tại Xe Điện Long Biên - Minh Anh.",
  alternates: {
    canonical: "https://xedienminhanh.vn/dimoon",
  },
};

export default function DimoonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Xe máy điện Powelldd Dimoon",
    "image": "https://xedienminhanh.vn/images/powelldd/dimoon/trang-bang-suong.png", 
    "description": "Khám phá xe máy điện Powelldd Dimoon với công nghệ AI tuyệt đỉnh, 100km cho một lần sạc. Trải nghiệm ngay tại Xe Điện Minh Anh.",
    "sku": "POWELLDD-DIMOON",
    "brand": {
      "@type": "Brand",
      "name": "Powelldd"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://xedienminhanh.vn/dimoon",
      "priceCurrency": "VND",
      "price": "17990000", 
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