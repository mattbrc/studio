"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

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

interface WodOperationsProps {
  workoutId: number;
}

export function WodOperations({ workoutId }: WodOperationsProps) {
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
        toast.error("Workout has already been submitted");
      } else {
        toast.error("Error, please try again later");
      }
      setIsSubmitLoading(false);
    },
  });

  const handleSubmit = () => {
    setIsSubmitLoading(true);
    mutation.mutate({ workoutId });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={isSubmitLoading} size="sm" variant="secondary">
          <div>
            {isSubmitLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Complete WOD</span>
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
