"use client";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
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
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import Link from "next/link";

interface Program {
  title: string;
  length: string;
  createdAt: Date;
  description: string;
  programId: number;
  active: boolean;
}

interface TrainingProps {
  data?: Program[];
  activeProgram: string | undefined;
  uniqueProgramId: string | null | undefined;
}

interface TrainingCardProps {
  program?: Program;
}

interface SubmitProgramProps {
  programId: number;
  name: string;
}

export function Programs({
  data,
  activeProgram,
  uniqueProgramId,
}: TrainingProps) {
  return (
    <div className="w-full md:w-1/2">
      <header className="mx-1 mb-4 md:mb-6 lg:mb-8">
        <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">Programs</h1>
        <p className="text-gray-400">View or start a new program</p>
      </header>
      <div className="pt-4">
        {activeProgram && (
          <div className="pb-4">
            <div className="flex items-center gap-2 pb-2">
              <p>Current Program:</p>
              <Badge variant="secondary">{activeProgram}</Badge>
            </div>
            <Button variant="acid" size="sm" asChild>
              <Link href={`/home/programs/${uniqueProgramId}`}>
                Program Overview
              </Link>
            </Button>

            <div className="pt-4">
              <Separator />
            </div>
          </div>
        )}

        {data ? (
          <div>
            {data.map((program) => (
              <TrainingCard key={program.programId} program={program} />
            ))}
            <Card>
              <CardHeader>
                <CardTitle>Don&apos;t see anything you like?</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p>Drop a request here and we&apos;ll make it happen.</p>
                  <Button className="mt-4" variant={"acid"} asChild>
                    <Link
                      href="https://tally.so/r/nG0LNL"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Request a Program
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div>No programs available</div>
        )}
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
              <CardTitle>No programs available</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p>Try again later...</p>
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
            {program.active ? (
              <StartProgram
                programId={program.programId}
                name={program.title}
              />
            ) : (
              <Button disabled={true} size="sm" variant="secondary">
                Coming Soon
              </Button>
            )}
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
