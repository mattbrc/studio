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
}

type WodData = Record<string, string>;

function formatUTCDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toUTCString().split(" ").slice(0, 4).join(" ");
}

export default function ProgramCard({ workout }: ProgramCardProps) {
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
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={isSubmitLoading} size="sm" variant="secondary">
                Complete Workout
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
