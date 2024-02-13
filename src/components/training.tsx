"use client";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import * as React from "react";
import { useRouter } from "next/navigation";
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

interface Program {
  title: string;
  length: string;
  createdAt: Date;
  description: string;
  programId: number;
}

interface TrainingProps {
  data?: Program[];
}

interface TrainingCardProps {
  program?: Program;
}

interface SubmitProgramProps {
  programId: number;
  name: string;
}

export function Training({ data }: TrainingProps) {
  if (!data)
    return (
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>An error occurred.</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p>No program available.</p>
        </CardContent>
      </Card>
    );

  return (
    <div className="w-full md:w-1/2">
      <header className="mx-1 mb-4 md:mb-6 lg:mb-8">
        <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">Training</h1>
        <p className="text-gray-400">
          View today&apos;s workout or start a new program
        </p>
      </header>
      <div className="pt-4">
        <div className="mx-1 space-y-1">
          <h4 className="text-sm font-medium leading-none">
            Available Programs
          </h4>
          <p className="text-sm text-muted-foreground">
            Continue Training or select a new programs.
          </p>
        </div>
        <Separator className="my-4" />
        {/* <TrainingCard program={data[0]} /> */}
        {data.map((program) => (
          <TrainingCard key={program.programId} program={program} />
        ))}
      </div>
    </div>
  );
}

const TrainingCard = ({ program }: TrainingCardProps) => {
  if (!program)
    return (
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>No program card</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p>Nothing...</p>
        </CardContent>
      </Card>
    );

  return (
    <Card className="mb-4 mt-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{program.title}</CardTitle>
            <CardDescription>Duration: {program.length}</CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            <StartProgram programId={program.programId} name={program.title} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p>{program.description}</p>
      </CardContent>
    </Card>
  );
};

function StartProgram({ programId, name }: SubmitProgramProps) {
  const router = useRouter();
  const [isSubmitLoading, setIsSubmitLoading] = React.useState<boolean>(false);

  const mutation = api.wod.startProgram.useMutation({
    onSuccess: () => {
      toast.success("Program Started");
      setIsSubmitLoading(false);
      router.refresh();
    },
    onError: () => {
      toast.error("Error, Something went wrong.");
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
        <Button disabled={isSubmitLoading} size="sm" variant="secondary">
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
