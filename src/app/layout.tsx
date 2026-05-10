import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ClientProvider from "@/ClientProvider";
import UserContext from "@/context/UserContext";

export const metadata: Metadata = {
  title: "Next App",
  description: "Full stack nextjs",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        <ClientProvider>
          <UserContext>
            {children}
          </UserContext>
        </ClientProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
