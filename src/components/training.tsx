import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";

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

export function Training({ data }: TrainingProps) {
  if (!data)
    return (
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>No program</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p>Nothing...</p>
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
      <TrainingCard program={data[0]} />
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
        <TrainingCard program={data[0]} />
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
            <Button size="sm" variant="secondary">
              <div>
                <span>Start</span>
              </div>
            </Button>
          </div>
        </div>
      </CardHeader>
      {/* <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{program.title}</CardTitle>
            <CardDescription>Duration: {program.length}</CardDescription>
            <Button size="sm" variant="secondary">
              <div>
                <span>Complete WOD</span>
              </div>
            </Button>
          </div>
        </div>
      </CardHeader> */}
      <CardContent>
        <p>{program.description}</p>
        {/* <span>
          <ul>
            {Object.entries(cond).map(([key, value]) => (
              <li key={key}>{`${value}`}</li>
            ))}
          </ul>
        </span>
        <CardDescription>{data?.notes}</CardDescription> */}
      </CardContent>
    </Card>
  );
};
