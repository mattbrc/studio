import { api } from "~/trpc/server";

export const metadata = {
  title: "Studio - Coaching",
};

export default async function Page() {
  const userProgramDetails = await api.wod.getUserWorkouts.query();
  const isCoached = userProgramDetails?.isBeingCoached;
  console.log("user program: ", userProgramDetails);

  // if (!userProgram) return <div>Something went wrong</div>;

  // const data = await api.wod.getLatest.query();

  return (
    <div className="container flex flex-col items-center justify-center px-4 py-6">
      <p>Coaching</p>
      <p>{isCoached}</p>
      {isCoached == 0 ? <p>no coaching</p> : <p>Being coached</p>}
    </div>
  );
}

// if no program selected (default everyone) - show nothing
// select program, show today's workout + 6 days into the future
// selecting program, can either start today or select a specific day to start on
