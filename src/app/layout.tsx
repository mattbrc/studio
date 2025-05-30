import "~/styles/globals.css";

import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans, GeistMono } from "geist/font";
import { dark } from "@clerk/themes";
import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { cn } from "~/lib/utils";
import { siteConfig } from "~/config/site";
import { CSPostHogProvider } from "~/app/_analytics/provider";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Acid Gambit",
    "Ranger",
    "SOF",
    "Get Selected",
    "Performance Optimization",
  ],
  authors: [
    {
      name: "acidgambit",
      url: "https://instagram.com/acidgambit",
    },
  ],
  creator: "acidgambit",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <ClerkProvider
        appearance={{
          baseTheme: dark,
        }}
      >
        <CSPostHogProvider>
          <body className={cn("min-h-screen antialiased")}>
            <TRPCReactProvider headers={headers()}>
              <Toaster
                position="bottom-center"
                reverseOrder={false}
                toastOptions={{
                  className: "",
                  style: {
                    background: "#27272A",
                    color: "#fff",
                  },
                }}
              />
              {children}
              {/* <Analytics /> */}
              {process.env.NEXT_PUBLIC_NODE_ENV === "PRODUCTION" && (
                <Analytics />
              )}
            </TRPCReactProvider>
          </body>
        </CSPostHogProvider>
      </ClerkProvider>
    </html>
  );
}
