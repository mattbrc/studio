import "~/styles/globals.css";

import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter as FontSans } from "next/font/google";
import { GeistSans, GeistMono } from "geist/font";

import { TRPCReactProvider } from "~/trpc/react";
import { cn } from "~/lib/utils";

// export const fontSans = FontSans({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <ClerkProvider>
        <body className={cn("min-h-screen antialiased")}>
          {/* <body className={`font-sans ${inter.variable}`}> */}
          <TRPCReactProvider headers={headers()}>
            {children}
            <Analytics />
          </TRPCReactProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
