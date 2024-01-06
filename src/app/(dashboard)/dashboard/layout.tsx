import { notFound } from "next/navigation";
import { MainNav } from "@/components/main-nav";
import { currentUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { UserAccountNav } from "~/components/user-account-nav";
import { SiteFooter } from "~/components/site-footer";

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
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
          <UserButton afterSignOutUrl="/" />
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
