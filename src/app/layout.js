import { SessionProvider } from "next-auth/react";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/ui/navbar";

const montserrat = localFont({
  src: [
    {
      path: "../../public/fonts/montserrat.regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/montserrat.medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/montserrat.semibold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/montserrat.bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/montserrat.light.ttf",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-montserrat",
});

const dmMono = localFont({
  src: [
    {
      path: "../../public/fonts/DMMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/DMMono-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/DMMono-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/DMMono-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/DMMono-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/DMMono-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
  ],
  variable: "--font-dm-mono",
});

export const metadata = {
  title: "Sift-ai",
  description:
    "Sift-ai is a AI powered search engine that helps you find information from the web.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${montserrat.variable} ${dmMono.variable} bg-background text-foreground font-sans`}
      >
        <SessionProvider>
          <Navbar />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
