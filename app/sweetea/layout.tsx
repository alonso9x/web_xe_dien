import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xe Điện Sweetea | Xe Điện Minh Anh",
  description: "Khám phá xe máy điện Powelldd Sweetea với thiết kế nhỏ gọn, kute và cực kỳ nữ tính. Trải nghiệm ngay tại Xe Điện Long Biên - Minh Anh.",
  alternates: {
    canonical: "https://xedienminhanh.vn/sweetea",
  },
};

export default function SweeteaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Chỉ việc trả về children, tuyệt đối không dùng thêm thẻ <html> hay <body> ở đây
  return <>{children}</>;
}