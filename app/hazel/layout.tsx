import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xe Điện Hazel | Xe Điện Minh Anh",
  description: "Khám phá xe máy điện Powelldd Hazel với thiết kế tinh tế trong từng đường nét. Trải nghiệm ngay tại Xe Điện Long Biên - Minh Anh.",
  alternates: {
    canonical: "https://xedienminhanh.vn/hazel",
  },
};

export default function HazelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // BỘ KHUNG SCHEMA CHUẨN SEO DÀNH RIÊNG CHO DÒNG HAZEL
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Xe máy điện Powelldd Hazel",
    "image": "https://xedienminhanh.vn/images/powelldd/hazel/hong-dao.png",
    "description": "Khám phá xe máy điện Powelldd Hazel với thiết kế tinh tế trong từng đường nét. Trải nghiệm ngay tại Xe Điện Long Biên - Minh Anh.",
    "sku": "POWELLDD-HAZEL",
    "brand": {
      "@type": "Brand",
      "name": "Powelldd"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://xedienminhanh.vn/hazel",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {children}
    </>
  );
}