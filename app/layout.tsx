import "./globals.css";
import type { Metadata } from "next";
import { Cabin, Inter, Poppins } from "next/font/google";
import Header from "./components/header";
const cabin = Cabin({ subsets: ["latin"] });
const poppins = Poppins({ weight: "400", subsets: ["latin"] });

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
  viewport: "width=device-width, initial-scale=1",
};
import { SessionProvider } from "next-auth/react";
import AuthProvider from "./utils/AuthProvider";
import { getServerSession } from "next-auth";
import { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import ReduxProvider from "./store/provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
      <ReduxProvider>
        <body className={`${inter.className} w-full flex flex-col items-center`}>
          <main className="w-full flex flex-col items-start">
              {children}
            </main>
        </body>
      </ReduxProvider>
      </html>
    </AuthProvider>
  );
}
