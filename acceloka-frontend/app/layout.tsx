import type { Metadata } from "next";
import { Instrument_Sans, Spline_Sans, DM_Mono } from 'next/font/google';
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const instrument = Instrument_Sans({ 
  subsets: ['latin'], 
  variable: '--font-heading' 
});

const spline = Spline_Sans({ 
  subsets: ['latin'], 
  variable: '--font-body' 
});

const dmMono = DM_Mono({ 
  weight: ['400', '500'], 
  subsets: ['latin'], 
  variable: '--font-mono' 
});

export const metadata: Metadata = {
  title: "Acceloka",
  description: "Booking Ticket System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrument.variable} ${spline.variable} ${dmMono.variable} flex h-screen bg-white`}
      >
        <aside className="bg-white">
          <Sidebar />
        </aside>

        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
