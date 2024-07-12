import { Icons } from "~/components/icons";
import { Programs } from "~/components/programs";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { api } from "~/trpc/server";
import Link from "next/link";
import { ProgramShowcase } from "~/components/program-showcase";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "~/components/ui/card";

export const metadata = {
  title: "Program Details",
};

export default async function Page() {
  // const programs = await api.wod.getAllPrograms.query();
  const workouts = await api.wod.getUserWorkouts.query();

  const today = new Date();

  // Function to format the date
  function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  }

  if (!workouts) {
    return (
      <div className="container flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full md:w-1/2">
          <header className="mx-1 mb-4 md:mb-6 lg:mb-8">
            <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
              Program Overview
            </h1>
            <p className="text-gray-400">Next 7 days at a glance</p>
          </header>
          <p>No workouts available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container flex flex-col items-center justify-center px-4 py-6">
      <div className="w-full md:w-1/2">
        <header className="mx-1 mb-4 md:mb-6 lg:mb-8">
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            Program Overview
          </h1>
          <p className="text-gray-400">Next 7 days at a glance</p>
        </header>
        {/* {workouts.workouts.slice(0, 7).map((workout, index) => (
          
          <WorkoutCard key={index} data={workout} />
        ))} */}
        {workouts.workouts.slice(0, 7).map((workout, index) => {
          // Calculate the date for each workout
          const workoutDate = new Date(today);
          workoutDate.setDate(today.getDate() + index);

          return (
            <WorkoutCard
              key={index}
              data={workout}
              date={formatDate(workoutDate)}
            />
          );
        })}
      </div>
    </div>
  );
}

type WodData = Record<string, string>;

interface Workout {
  // date: Date;
  createdAt: Date;
  workoutId: number;
  title: string | null;
  strength: unknown;
  conditioning: unknown;
}

interface WorkoutProps {
  data: Workout;
  date: string;
}

const WorkoutCard: React.FC<WorkoutProps> = ({ data, date }) => {
  const str: WodData = data.strength as WodData;
  const cond: WodData = data.conditioning as WodData;

  function formatUTCDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toUTCString().split(" ").slice(0, 4).join(" ");
  }

  return (
    <Card className="mb-4 w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="underline">{date}</CardTitle>
            <CardDescription className="pt-1">{data?.title}</CardDescription>
            {/* <CardDescription>
              {data.date
                ? formatUTCDate(data.date.toUTCString())
                : "No date available"}
            </CardDescription> */}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-bold">Strength:</p>
        <span>
          <ul>
            {Object.entries(str).map(([key, value]) => (
              <li key={key}>{`${value}`}</li>
            ))}
          </ul>
        </span>

        <p className="mt-2 font-bold">Conditioning:</p>
        <span>
          <ul>
            {Object.entries(cond).map(([key, value]) => (
              <li key={key}>{`${value}`}</li>
            ))}
          </ul>
        </span>
      </CardContent>
    </Card>
  );
};
