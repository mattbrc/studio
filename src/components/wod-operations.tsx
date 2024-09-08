"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "./ui/button";
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
} from "@/components/ui/alert-dialog";
import { Icons } from "@/components/icons";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";
import { usePostHog } from "posthog-js/react";

interface WodOperationsProps {
  workoutId: number;
  isComplete: boolean;
}

// submit a workout row to log table in DB for daily workouts (/home/wod)
export function WodOperations({ workoutId, isComplete }: WodOperationsProps) {
  const posthog = usePostHog();
  const router = useRouter();
  const [isSubmitLoading, setIsSubmitLoading] = React.useState<boolean>(false);

  const mutation = api.wod.submitWod.useMutation({
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

  const handleSubmit = () => {
    setIsSubmitLoading(true);
    posthog.capture("submit_wod");
    mutation.mutate({ workoutId });
  };

  if (isComplete) {
    return (
      <Button disabled={true} size="sm" variant="secondary">
        Completed ✅
      </Button>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={isSubmitLoading} size="sm" variant="secondary">
          <div>
            {isSubmitLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <span>Complete WOD</span>
            )}
          </div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Complete Workout of the Day</AlertDialogTitle>
          <AlertDialogDescription>
            Once complete with the workout, click submit to continue progressing
            in rank.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isSubmitLoading} onClick={handleSubmit}>
            <span>Submit</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
