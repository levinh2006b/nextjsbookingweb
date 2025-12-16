//Các elements trong đây có ở mọi trang

import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import LightRays from "@/components/LightRays";
import Navbar from "@/components/NavBar";
import { Analytics } from "@vercel/analytics/react";    //Liên kết vercel để lưu người đã đăng ký

const schibsted_Grotesk = Schibsted_Grotesk({
  variable: "--font-schibsted_Grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});
//Simply tải font
//Tải trong phần chữ ký tự Latin thôi cho nhẹ

export const metadata: Metadata = {    // Metadata -> For SEO
  title: "Party SignUp",               //Hiện lên thanh Tab
  description: "People throw parties in your area, you sign up in this site",    //Dòng hiện dưới tiêu đề trên google
};

export default function RootLayout({           //Cấu trúc gốc của trang web
  children,                                    //children là code trong page.tsx của từng đường dẫn
}: Readonly<{        // : là Gán kiểu cho children là 1 thứ được niêm phong Readonly, không được thay đổi   
  children: React.ReactNode;   // Bên trong nó chắc chắn có children (đảm bảo cho TypeScript)
                               // React.ReactNode là 1 component cực rộng lượng, nó chứa anything React có thể vẽ lên được
}>) {
  return (
    <html lang="en">
      <body                //Mọi web đều có <html> và <body> -> Layout đảm bảo không cần viết lại ở mọi trang
        className={`${schibsted_Grotesk.variable} ${martianMono.variable} min-h-screen antialiased`}   //antialiased là property khiến các đường cong được mượt mà, k bị pixelated
      >
    <Navbar/>
  <div className="absolute inset-0 top-0 z-[-1] min-h-screen">

  <LightRays
    raysOrigin="top-center-offset"
    raysColor="#D4AF37"
    raysSpeed={0.5}
    lightSpread={0.9}
    rayLength={0.7}
    followMouse={true}
    mouseInfluence={0.04}
    noiseAmount={0.1}
    distortion={0.05}
    className="custom-rays"
  />
    
</div>


<main>

        {children}      {/* Điền nội dung từng trang con page.tsx vào */}
</main>
<Analytics />    {/* Không hiển thị => Đặt dưới main và thường đặt cuối body để tránh chậm hiển thị UI */}
      </body>
    </html>
  );
}
