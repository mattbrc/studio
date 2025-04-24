import { MainNav } from "@/components/main-nav";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { SiteFooter } from "~/components/site-footer";
import { MenuDropdown } from "~/components/menu-dropdown";
import { Button, buttonVariants } from "~/components/ui/button";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import Image from "next/image";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await currentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40">
        <div className="header-bg container flex h-16 items-center justify-between py-4">
          <Image src="/ag_logo.png" alt="logo" width={32} height={32} />
          <MainNav />
          {user ? (
            <Link href="/home" className={buttonVariants({ variant: "acid" })}>
              Home
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className={buttonVariants({ variant: "acid" })}
            >
              Sign in
            </Link>
          )}
        </div>
      </header>
      <div>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
