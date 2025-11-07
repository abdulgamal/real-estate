import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Secure Mortgage Origination Platform",
  description:
    "Fully compliant mortgage application process with built-in regulatory requirements",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
