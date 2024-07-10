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
}

interface TrainingCardProps {
  program?: Program;
}

export function ProgramShowcase({ data }: TrainingProps) {
  return (
    <div>
      {data ? (
        <div>
          {data.map((program) => (
            <TrainingCard key={program.programId} program={program} />
          ))}
        </div>
      ) : (
        <div>No programs available</div>
      )}
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
              <Button disabled={true} size="sm" variant="secondary">
                Start Program
              </Button>
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
