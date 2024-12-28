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
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import Link from "next/link";
// import { StartProgram } from "./start-program-button";
import dynamic from "next/dynamic";
import { StartProgramOptions } from "./start-program-options";
import { Input } from "./ui/input";

interface Program {
  title: string;
  length: string;
  createdAt: Date;
  description: string;
  programId: number;
  active: boolean;
  options: boolean;
  parentId: number | null;
}

interface TrainingProps {
  data?: Program[];
  childPrograms?: Program[];
  activeProgram: string | undefined;
  uniqueProgramId: string | null | undefined;
}

interface TrainingCardProps {
  program?: Program;
  childPrograms?: Program[];
}

interface SubmitProgramProps {
  programId: number;
  name: string;
}

const StartProgram = dynamic(
  () => import("./start-program-button").then((mod) => mod.StartProgram),
  {
    ssr: false,
  },
);

export function Programs({
  data,
  childPrograms,
  activeProgram,
  uniqueProgramId,
}: TrainingProps) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredPrograms = React.useMemo(() => {
    if (!data) return [];
    return data.filter((program) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        program.title.toLowerCase().includes(searchLower) ||
        program.description.toLowerCase().includes(searchLower)
      );
    });
  }, [data, searchTerm]);

  return (
    <div className="w-full md:w-1/2">
      <header className="mx-1 mb-4 md:mb-6 lg:mb-8">
        <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">Programs</h1>
        <p className="text-gray-400">View or start a new program</p>
      </header>

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

      <div className="mb-6 w-full">
        <Input
          placeholder="Filter programs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {data ? (
        <div>
          {filteredPrograms.map((program) =>
            program.options ? (
              <OptionsCard
                key={program.programId}
                program={program}
                childPrograms={childPrograms}
              />
            ) : (
              <TrainingCard key={program.programId} program={program} />
            ),
          )}
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

const OptionsCard = ({ program, childPrograms }: TrainingCardProps) => {
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
              <StartProgramOptions
                programId={program.programId}
                name={program.title}
                childPrograms={childPrograms?.filter(
                  (p) => p.parentId === program.programId,
                )}
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

// function StartProgram({ programId, name }: SubmitProgramProps) {
//   const router = useRouter();
//   const [isSubmitLoading, setIsSubmitLoading] = React.useState<boolean>(false);

//   const mutation = api.wod.startProgram.useMutation({
//     onSuccess: () => {
//       toast.success("Program Started");
//       setIsSubmitLoading(false);
//       router.refresh();
//     },
//     onError: (e) => {
//       const errorCode = e.data?.code;
//       if (errorCode === "TOO_MANY_REQUESTS") {
//         toast.error("Rate limit reached. Try again in 1 minute.");
//       } else {
//         toast.error("Error, Something went wrong.");
//       }
//       setIsSubmitLoading(false);
//     },
//   });

//   const handleSubmit = () => {
//     setIsSubmitLoading(true);
//     mutation.mutate({ programId });
//   };

//   return (
//     <AlertDialog>
//       <AlertDialogTrigger asChild>
//         <Button disabled={isSubmitLoading} size="sm" variant="acid">
//           <div>
//             {isSubmitLoading ? (
//               <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
//             ) : (
//               <span>Start Program</span>
//             )}
//           </div>
//         </Button>
//       </AlertDialogTrigger>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Confirm New Program</AlertDialogTitle>
//           <AlertDialogDescription>Begin {name}</AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel>Cancel</AlertDialogCancel>
//           <AlertDialogAction disabled={isSubmitLoading} onClick={handleSubmit}>
//             <span>Submit</span>
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }
