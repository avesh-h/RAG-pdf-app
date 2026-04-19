import { SessionProvider } from "next-auth/react";
import "./globals.css";
import Navbar from "@/components/ui/navbar";

export const metadata = {
  title: "RAG PDF Chat",
  description: "Chat with your PDF using AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Navbar />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
