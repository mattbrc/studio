import { currentUser } from "@clerk/nextjs/server";
import { ResourcesCard } from "~/components/resources";
import TrainingWod from "~/components/training-wod";
import { UserCard } from "~/components/user-card";
import { api } from "~/trpc/server";

export const metadata = {
  title: "Studio - Home",
};

export default async function Page() {
  const user = await currentUser();
  const userWorkoutDetails = await api.wod.getUserSingleWorkout.query();
  // console.log("user program today workout:", userWorkout?.program?.title);

  return (
    <div className="container flex flex-col items-center justify-center gap-6 px-4 py-6">
      <h1 className="text-2xl font-bold">Home</h1>
      <UserCard
        id={user?.id}
        username={user?.username}
        title={userWorkoutDetails?.program?.title}
      />
      <TrainingWod
        workout={userWorkoutDetails?.workouts[0]}
        currentWorkoutId={userWorkoutDetails?.currentWorkoutId}
        uniqueProgramId={userWorkoutDetails?.uniqueProgramId}
      />
      <ResourcesCard />
    </div>
  );
}
