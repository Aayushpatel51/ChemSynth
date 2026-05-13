import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChemSynth | Synthesis Edition",
  description: "Advanced chemical synthesis stoichiometry and SOP engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
