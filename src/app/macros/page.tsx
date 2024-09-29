import Link from "next/link";
import MacroCalculator from "~/app/macros/macro-form";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Icons } from "~/components/icons";
import { auth } from "@clerk/nextjs/server";
import { api } from "~/trpc/server";

export default async function Page() {
  const { userId } = auth();
  const userMacros = await api.profile.getUserMacros.query();

  const defaultValues = userMacros
    ? {
        gender: userMacros.gender as "Male" | "Female" | undefined,
        age: userMacros.age ?? undefined,
        height: userMacros.height ?? undefined,
        weight: userMacros.weight ?? undefined,
        activityFactor:
          (userMacros.activityFactor as
            | "1.2"
            | "1.375"
            | "1.55"
            | "1.725"
            | "1.9"
            | undefined) ?? undefined,
      }
    : undefined;

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
        <MacroCalculator defaultValues={defaultValues} />
      </div>
    </>
  );
}
