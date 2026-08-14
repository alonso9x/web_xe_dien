import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xe Điện Wespan Pro | Xe Điện Minh Anh",
  description: "Khám phá xe máy điện Powelldd Wespan Pro với vẻ đẹp khó cưỡng, đậm chất Ý. Trải nghiệm ngay tại Xe Điện Long Biên - Minh Anh.",
  alternates: {
    canonical: "https://xedienminhanh.vn/wespan-pro",
  },
};

export default function WespanProLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // BỘ KHUNG SCHEMA CHUẨN SEO DÀNH RIÊNG CHO TRÙM CUỐI WESPAN PRO
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Xe máy điện Powelldd Wespan Pro",
    // ⚠️ CHÚ Ý: Kiểm tra lại xem anh(12).jpg có nằm trong thư mục gallery không nhé
    "image": "https://xedienminhanh.vn/images/vehicles/wespan-pro/gallery/anh(12).jpg",
    "description": "Khám phá xe máy điện Powelldd Wespan Pro với vẻ đẹp khó cưỡng, đậm chất Ý. Trải nghiệm ngay tại Xe Điện Long Biên - Minh Anh.",
    "sku": "POWELLDD-WESPAN-PRO",
    "brand": {
      "@type": "Brand",
      "name": "Powelldd"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://xedienminhanh.vn/wespan-pro",
      "priceCurrency": "VND",
      "price": "20500000",
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