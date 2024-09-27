import Link from "next/link";
import { SiteFooter } from "~/components/site-footer";
import { Button } from "~/components/ui/button";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

interface MacrosLayoutProps {
  children: React.ReactNode;
}

export default function MacrosLayout({ children }: MacrosLayoutProps) {
  return (
    <div>
      <header className="flex flex-row items-center justify-between px-4 pt-4">
        <p className="font-mono text-sm font-bold text-[hsl(161,78%,58%)]">
          ACID GAMBIT
        </p>
        <SignedIn>
          <Button asChild variant="acid" size="sm">
            <Link href="/home">Home</Link>
          </Button>
        </SignedIn>
        <SignedOut>
          <Button asChild variant="acid" size="sm">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </SignedOut>
      </header>
      <main className="container mx-auto py-8 md:w-3/4">{children}</main>
      <SiteFooter />
    </div>
  );
}
