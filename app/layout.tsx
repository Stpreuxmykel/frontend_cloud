"use client";

import { SessionProvider } from "next-auth/react";
import Navbar from "./component/navbar/Navbar";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { Inter } from "next/font/google";
import { getToken } from "./lib/auth";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {

 
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster />
        
        <SessionProvider>
          <Navbar />
          <main className="pb-0 pt-10">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
