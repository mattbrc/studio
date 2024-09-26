import Link from "next/link";
import MacroCalculator from "~/app/macros/macro-form";
import { Button } from "~/components/ui/button";

export default function Page() {
  return (
    <>
      {/* <header className="flex flex-row items-center justify-between px-4 pt-4">
        <p className="font-mono text-sm font-bold text-[hsl(161,78%,58%)]">
          ACID GAMBIT
        </p>
        <Button asChild variant="acid" size="sm">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </header> */}
      <div>
        <h1 className="mb-6 text-3xl font-bold">Macro Calculator</h1>
        <MacroCalculator />
      </div>
    </>
  );
}
