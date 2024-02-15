import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { buttonVariants } from "./ui/button";

import { TrainingWodOperations } from "./training-wod-ops";
import { cn } from "~/lib/utils";
import Link from "next/link";

type WodData = Record<string, string>;

interface Workout {
  createdAt: Date;
  workoutId: number;
  title: string | null;
  strength: unknown;
  conditioning: unknown;
  programId: number | null;
  orderId: number;
  notes: string | null;
}
interface WorkoutProps {
  workout: Workout | undefined;
  currentWorkoutId: number | undefined;
}

// pass current program and today's wod from program
// if no data, return training page button
export default function TrainingWod({
  workout,
  currentWorkoutId,
}: WorkoutProps) {
  const str: WodData = workout?.strength as WodData;
  const cond: WodData = workout?.conditioning as WodData;

  function formatUTCDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toUTCString().split(" ").slice(0, 4).join(" ");
  }

  if (!workout)
    return (
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Today&apos;s Workout</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p>No workout available. Select a program to get started.</p>
          <div className="pt-4">
            <Link
              href="/home/training"
              className={cn(buttonVariants({ size: "sm" }), "px-4")}
            >
              Select a Program
            </Link>
          </div>
        </CardContent>
      </Card>
    );

  return (
    <Card className="w-full md:w-1/2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Today&apos;s Workout</CardTitle>
            <CardDescription>
              {workout?.title ? formatUTCDate(Date()) : "No date available"}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            <TrainingWodOperations
              workoutId={workout?.workoutId}
              programId={workout?.programId}
              currentWorkoutId={currentWorkoutId}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="underline">{workout?.title}</p>
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
}
