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

async function submitWod(workoutId: number) {
  const response = await fetch(`/api/posts/${workoutId}`, {
    method: "DELETE",
  });

  if (!response?.ok) {
    // toast({
    //   title: "Something went wrong.",
    //   description: "Your post was not deleted. Please try again.",
    //   variant: "destructive",
    // })
    toast.success("Well done! Workout Completed.");
  }

  return true;
}

interface WodOperationsProps {
  workoutId: number;
}

export function WodOperations({ workoutId }: WodOperationsProps) {
  const router = useRouter();
  const [showSubmitAlert, setShowSubmitAlert] = React.useState<boolean>(false);
  const [isSubmitLoading, setIsSubmitLoading] = React.useState<boolean>(false);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="secondary">
          Complete WOD
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
          {/* <AlertDialogAction>Submit</AlertDialogAction> */}
          <AlertDialogAction
            onClick={async (event) => {
              event.preventDefault();
              setIsSubmitLoading(true);

              const completed = await submitWod(workoutId);

              if (completed) {
                setIsSubmitLoading(false);
                setShowSubmitAlert(false);
                router.refresh();
              }
            }}
            className="bg-red-600 focus:ring-red-600"
          >
            {isSubmitLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Delete</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
