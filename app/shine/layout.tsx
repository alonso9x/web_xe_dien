import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xe Điện Shine | Xe Điện Minh Anh",
  description: "Khám phá xe máy điện Powelldd Shine pro, dẫn đầu xu hướng, tỏa sáng cá tính! . Trải nghiệm ngay tại Xe Điện Long Biên - Minh Anh.",
  alternates: {
    canonical: "https://xedienminhanh.vn/shine",
  },
};

export default function ShineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // BỘ KHUNG SCHEMA CHUẨN SEO DÀNH RIÊNG CHO DÒNG SHINE PRO
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Xe máy điện Powelldd Shine Pro",
    "image": "https://xedienminhanh.vn/images/powelldd/vehicles/shine-pro/anh(2).jpg",
    "description": "Khám phá xe máy điện Powelldd Shine pro, dẫn đầu xu hướng, tỏa sáng cá tính! . Trải nghiệm ngay tại Xe Điện Long Biên - Minh Anh.",
    "sku": "POWELLDD-SHINE-PRO",
    "brand": {
      "@type": "Brand",
      "name": "Powelldd"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://xedienminhanh.vn/shine",
      "priceCurrency": "VND",
      "price": "14990000",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {children}
    </>
  );
}