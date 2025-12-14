//Các elements trong đây có ở mọi trang

import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import LightRays from "@/components/LightRays";
import Navbar from "@/components/NavBar";
import { Analytics } from "@vercel/analytics/react";

const schibsted_Grotesk = Schibsted_Grotesk({
  variable: "--font-schibsted_Grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Party SignUp",
  description: "People throw parties in your area, you sign up in this site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${schibsted_Grotesk.variable} ${martianMono.variable} min-h-screen antialiased`}
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

        {children}
</main>
<Analytics />
      </body>
    </html>
  );
}
