import Link from "next/link";
import MacroCalculator from "~/app/macros/macro-form";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Icons } from "~/components/icons";
import { auth } from "@clerk/nextjs/server";

export default function Page() {
  const { userId } = auth();

  return (
    <>
      <div>
        <h1 className="mb-2 text-3xl font-bold">TDEE Calculator</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Calculate your total daily energy expenditure, recommended macros, and
          custom meal plans (coming soon).
        </p>
        {!userId && (
          <Alert>
            <Icons.alert />
            <AlertTitle className="font-bold">
              Want to generate a meal plan or save your macros?
            </AlertTitle>
            <AlertDescription>
              Sign In or Sign Up to get started.
            </AlertDescription>
            <div className="flex py-2">
              <Link href="/sign-in">
                <Button>Sign In</Button>
              </Link>
            </div>
          </Alert>
        )}
        <MacroCalculator />
      </div>
    </>
  );
}
