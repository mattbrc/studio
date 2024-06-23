import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { WodOperations } from "./wod-operations";

type WodData = Record<string, string>;
interface Workout {
  date: Date;
  createdAt: Date;
  wodId: number;
  title: string | null;
  strength: unknown;
  conditioning: unknown;
}
interface WorkoutProps {
  data?: Workout;
}

export function Wod({ data }: WorkoutProps) {
  const str: WodData = data?.strength as WodData;
  const cond: WodData = data?.conditioning as WodData;

  function formatUTCDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toUTCString().split(" ").slice(0, 4).join(" ");
  }

  if (!data)
    return (
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Coming Monday, June 24th, 2024</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Daily functional workouts written by our resident CrossFit coach and
            endurance athlete, Lee. The focus is on building a functional base
            around the core compound lifts, steady state endurance, and nasty
            heart pounders.
          </CardDescription>
        </CardContent>
      </Card>
    );

  return (
    <Card className="w-full md:w-1/2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Daily Functional</CardTitle>
            <CardDescription>
              {data?.date
                ? formatUTCDate(data.date.toUTCString())
                : "No date available"}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            <WodOperations workoutId={data?.wodId} />
            <ProgramDetails />
          </div>
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

const ProgramDetails = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="secondary">
          <div>
            <span>Details</span>
          </div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Daily Functional</AlertDialogTitle>
          <AlertDialogDescription>
            Daily functional workouts written by our resident CrossFit coach and
            endurance athlete, Lee. The focus is on building a functional base
            around the core compound lifts, steady state endurance, and nasty
            heart pounders.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProgramDetails;
