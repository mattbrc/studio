"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "./ui/button";
import { api } from "~/trpc/react";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { Icons } from "@/components/icons";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { usePostHog } from "posthog-js/react";
import { Badge } from "./ui/badge";

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

interface ProgramCardProps {
  workout: Workout | undefined;
  title: string | undefined;
}

type WodData = Record<string, string>;

interface UserPathDetails {
  createdAt: Date;
  updatedAt: Date | null;
  active: boolean;
  userId: string;
  currentWorkoutId: number;
  pathId: number;
  program: {
    id: number;
    userId: string;
    generatedAt: Date;
    program: unknown;
  };
}

function formatUTCDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toUTCString().split(" ").slice(0, 4).join(" ");
}

export function PathCard({ path }: { path: UserPathDetails }) {
  const program = path.program.program as {
    workouts: {
      title: string;
      orderId: number;
      strength: Record<string, string>;
      conditioning: Record<string, string>;
    }[];
  };

  const currentWorkout = program.workouts.find(
    (workout) => workout.orderId === path.currentWorkoutId,
  );

  if (!currentWorkout) return <p>No workout found</p>;

  return (
    <Card className="w-full md:w-1/2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            {/* <CardTitle>{currentWorkout.title}</CardTitle> */}
            <CardTitle>{currentWorkout.title}</CardTitle>
            <CardDescription>{formatUTCDate(Date())}</CardDescription>
            <Badge variant="acid">The Path</Badge>
          </div>
          <div className="self-start">
            <Button size="sm" variant="secondary">
              Complete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-bold">Strength:</p>
        <span>
          <ul>
            {Object.entries(currentWorkout.strength).map(([key, value]) => (
              <li key={key}>{`${value}`}</li>
            ))}
          </ul>
        </span>
        <p className="mt-2 font-bold">Conditioning:</p>
        <span>
          <ul>
            {Object.entries(currentWorkout.conditioning).map(([key, value]) => (
              <li key={key}>{`${value}`}</li>
            ))}
          </ul>
        </span>
      </CardContent>
    </Card>
  );
}

export default function ProgramCard({ workout, title }: ProgramCardProps) {
  const posthog = usePostHog();
  const str: WodData = workout?.strength as WodData;
  const cond: WodData = workout?.conditioning as WodData;

  const [isSubmitLoading, setIsSubmitLoading] = React.useState<boolean>(false);

  const router = useRouter();

  const mutation = api.wod.submitProgramWorkout.useMutation({
    onSuccess: () => {
      toast.success("Well done! Workout completed.");
      setIsSubmitLoading(false);
      router.refresh();
    },
    onError: (e) => {
      const errorCode = e.data?.code;
      if (errorCode === "CONFLICT") {
        toast.error(e.message);
      } else {
        toast.error("Error, please try again later");
      }
      setIsSubmitLoading(false);
    },
  });

  const handleUpdate = () => {
    setIsSubmitLoading(true);
    posthog.capture("complete_program_workout");
    mutation.mutate({
      workoutId: workout?.workoutId,
      programId: workout?.programId,
    });
  };

  if (!workout)
    return (
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>No workout available</CardTitle>
              <CardDescription>{formatUTCDate(Date())}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p>Select a program to get started.</p>
          <div className="pt-4">
            <Link
              href="/home/programs"
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
            <CardTitle>{workout?.title}</CardTitle>
            <CardDescription>{formatUTCDate(Date())}</CardDescription>
            <Badge variant="acid">{title}</Badge>
          </div>
          <div className="self-start">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={isSubmitLoading}
                  size="sm"
                  variant="secondary"
                >
                  Complete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Complete today&apos;s workout
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Once complete with the workout, click submit to continue
                    progressing in rank.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isSubmitLoading}
                    onClick={handleUpdate}
                  >
                    <span>Submit</span>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
}
