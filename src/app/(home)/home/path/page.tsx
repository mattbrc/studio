import PathTerminal from "@/components/path-terminal";
import { clerkClient } from "@clerk/nextjs/server";
import { generateWorkouts } from "@/lib/ai/generate";

export const metadata = {
  title: "The Path",
};

export default async function Page() {
  // Call generateWorkouts with a goal
  const workouts = await generateWorkouts("hybrid");

  // Log the generated workouts
  console.log("Generated workouts:", JSON.stringify(workouts, null, 2));

  return (
    <div className="container flex flex-col items-center justify-center px-4 py-6">
      <div className="h-screen w-full md:w-2/3 lg:w-1/2">
        <header className="mx-1 mb-4 md:mb-6 lg:mb-8">
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            The Path
          </h1>
        </header>
        {/* <PathTerminal /> */}
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(workouts, null, 2)}
        </pre>
      </div>
    </div>
  );
}
