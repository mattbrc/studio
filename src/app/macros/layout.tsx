import Link from "next/link";
import MacroCalculator from "~/app/macros/macro-form";
import { SiteFooter } from "~/components/site-footer";
import { Button } from "~/components/ui/button";

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
        <Button asChild variant="acid" size="sm">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </header>
      <main className="container mx-auto py-8 md:w-3/4">{children}</main>
      <SiteFooter />
    </div>
  );
}
