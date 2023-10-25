import { notFound } from "next/navigation";

import { dashboardConfig } from "@/config/dashboard";
import { MainNav } from "@/components/main-nav";
import { SiteFooter } from "@/components/site-footer";
import { auth, currentUser } from "@clerk/nextjs";
// import { UserAccountNav } from "~/components/user-account-nav";
import { UserButton } from "@clerk/nextjs";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await currentUser();

  if (!user) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40">
        <div className="container flex h-16 items-center justify-between border border-red-400 py-4">
          <MainNav />
          {/* <UserAccountNav name={user?.firstName} /> */}
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>
      {/* <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]"> */}
      <div>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
