import "~/styles/globals.css";

import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans, GeistMono } from "geist/font";
import { dark } from "@clerk/themes";

import { TRPCReactProvider } from "~/trpc/react";
import { cn } from "~/lib/utils";

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
        <body className={cn("min-h-screen antialiased")}>
          <TRPCReactProvider headers={headers()}>
            {children}
            <Analytics />
          </TRPCReactProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
