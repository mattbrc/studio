// StartProgram.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";
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
import { Button } from "./ui/button";
import { Icons } from "@/components/icons";

interface SubmitProgramProps {
  programId: number;
  name: string;
}

export function StartProgram({ programId, name }: SubmitProgramProps) {
  const router = useRouter();
  const [isSubmitLoading, setIsSubmitLoading] = React.useState<boolean>(false);

  const mutation = api.wod.startProgram.useMutation({
    onSuccess: () => {
      toast.success("Program Started");
      setIsSubmitLoading(false);
      router.refresh();
    },
    onError: (e) => {
      const errorCode = e.data?.code;
      if (errorCode === "TOO_MANY_REQUESTS") {
        toast.error("Rate limit reached. Try again in 1 minute.");
      } else {
        toast.error("Error, Something went wrong.");
      }
      setIsSubmitLoading(false);
    },
  });

  const handleSubmit = () => {
    setIsSubmitLoading(true);
    mutation.mutate({ programId });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={isSubmitLoading} size="sm" variant="acid">
          <div>
            {isSubmitLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <span>Start Program</span>
            )}
          </div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm New Program</AlertDialogTitle>
          <AlertDialogDescription>Begin {name}</AlertDialogDescription>
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
