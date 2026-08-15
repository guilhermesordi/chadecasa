import type { Metadata, Viewport } from "next";
import { Fraunces, Nunito } from "next/font/google";
import { getSettings } from "@/lib/settings";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#f7f1e8",
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings.eventTitle || "Chá de casa";
  return {
    title: {
      default: title,
      template: `%s · ${title}`,
    },
    description:
      settings.welcomeText ||
      "Lista de presentes do chá de casa. Pode contribuir só uma parte dos itens.",
    applicationName: title,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-cream font-sans text-ink">{children}</body>
    </html>
  );
}
