import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "형상모델링 검토 작업장 평가",
  description: "NCS LM1501020213 형상모델링 검토 작업장 평가"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-slate-100 text-slate-800 leading-relaxed">{children}</body>
    </html>
  );
}
