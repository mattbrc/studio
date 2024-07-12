import { Icons } from "~/components/icons";
import { Programs } from "~/components/programs";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { api } from "~/trpc/server";
import Link from "next/link";
import { ProgramShowcase } from "~/components/program-showcase";

export const metadata = {
  title: "Programs",
};

export default async function Page() {
  const programs = await api.wod.getAllPrograms.query();
  const userProgramDetails = await api.wod.getUserWorkouts.query();
  const sub = await api.stripe.getSubscription.query();

  return (
    <div className="container flex flex-col items-center justify-center px-4 py-6">
      {sub ? (
        <Programs
          data={programs}
          activeProgram={userProgramDetails?.program?.title}
          uniqueProgramId={userProgramDetails?.uniqueProgramId}
        />
      ) : (
        <div className="w-full md:w-1/2">
          <header className="mx-1 mb-4 md:mb-6 lg:mb-8">
            <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
              Programs
            </h1>
            <p className="text-gray-400">View or start a new program</p>
          </header>
          <Alert className="w-full">
            <Icons.alert />
            <AlertTitle className="font-bold">
              You&apos;re on the free plan!
            </AlertTitle>
            <AlertDescription>
              Upgrade now to get full access to all programs.
            </AlertDescription>
            <div className="flex py-2">
              <Link href="/billing">
                <Button>Upgrade</Button>
              </Link>
            </div>
          </Alert>
          <ProgramShowcase data={programs} />
        </div>
      )}
    </div>
  );
}
