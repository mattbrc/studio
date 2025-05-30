import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Icons } from "~/components/icons";
import { ResourcesCard } from "~/components/resources";
import ProgramCard, { PathCard } from "~/components/program-card-home";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { UserCard } from "~/components/user-card";
import { api } from "~/trpc/server";

export const metadata = {
  title: "Home",
};

export const revalidate = 0; // Disable caching for this page

export default async function Page() {
  const user = await currentUser();
  const userWorkoutDetails = await api.wod.getUserSingleWorkout.query();
  const userPathDetails = await api.ai.getUserPathDetails.query();
  console.log(userPathDetails);
  const sub = await api.stripe.getSubscription.query();

  return (
    <div className="container flex flex-col items-center justify-center gap-6 px-4 py-6">
      <h1 className="text-2xl font-bold">Home</h1>
      {!sub && (
        <Alert className="w-full md:w-1/2">
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
      )}
      <UserCard
        id={user?.id}
        username={user?.username}
        title={userWorkoutDetails?.program?.title}
        subscription={sub}
        path={!!userPathDetails && userPathDetails.active}
      />
      {userPathDetails && <PathCard path={userPathDetails} />}
      <ProgramCard
        workout={userWorkoutDetails?.workouts[0]}
        title={userWorkoutDetails?.program?.title}
      />
      <ResourcesCard />
    </div>
  );
}
