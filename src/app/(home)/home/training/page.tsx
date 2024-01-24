import { Recap } from "~/components/recap";
import { Training } from "~/components/training";
import { api } from "~/trpc/server";

export const metadata = {
  title: "Studio - Training",
};

export default async function Page() {
  // const programs = await api.wod.getAllPrograms.query();
  const recap = await api.wod.getRecap.query();

  return (
    <div className="container flex flex-col items-center justify-center px-4 py-6">
      {/* <Training data={programs} /> */}
      <Recap data={recap} />
    </div>
  );
}

// if no program selected (default everyone) - show nothing
// select program, show today's workout + 6 days into the future
// selecting program, can either start today or select a specific day to start on
