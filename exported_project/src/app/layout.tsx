"use client";

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import QueryProvider from "@/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BT Go - Gestiune Tranzacții",
  description: "Aplicație pentru gestionarea tranzacțiilor personale",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body className={inter.className}>
        <QueryProvider>
          <main className="container mx-auto py-8">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
