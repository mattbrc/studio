import { Programs } from "~/components/programs";
import { api } from "~/trpc/server";

export const metadata = {
  title: "Studio - Training",
};

export default async function Page() {
  const programs = await api.wod.getAllPrograms.query();
  const userProgramDetails = await api.wod.getUserWorkouts.query();

  // if (!userProgram) return <div>Something went wrong</div>;

  // const data = await api.wod.getLatest.query();

  return (
    <div className="container flex flex-col items-center justify-center px-4 py-6">
      <Programs
        data={programs}
        activeProgram={userProgramDetails?.program?.title}
      />
    </div>
  );
}

// if no program selected (default everyone) - show nothing
// select program, show today's workout + 6 days into the future
// selecting program, can either start today or select a specific day to start on
