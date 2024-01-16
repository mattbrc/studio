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
  strength: unknown; // You may want to define a more specific type here if possible
  conditioning: unknown; // Same as above
  program: string | null;
  notes: string | null;
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
              <CardTitle>Workout of the Day</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p>No workout available</p>
        </CardContent>
      </Card>
    );

  return (
    <Card className="w-full md:w-1/2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Workout of the Day</CardTitle>
            <CardDescription>
              {data?.date
                ? formatUTCDate(data.date.toUTCString())
                : "No date available"}
            </CardDescription>
            <CardDescription>10-Miler Prep</CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            <WodOperations workoutId={data?.wodId} />
            <ProgramDetails />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="underline">{data?.title}</p>
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
        <CardDescription>{data?.notes}</CardDescription>
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
          <AlertDialogTitle>
            10-Miler Strength + Conditioning Program
          </AlertDialogTitle>
          <AlertDialogDescription>
            The focus of this program is to improve speed specifically in the
            10-miler distance, and slightly improve strength in the compound
            movements, as well as explosive power and lower body stability and
            injury prevention. This program will run from 15JAN-20APR 2024.
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

// a

// {
//   "a": "Back Squat/Leg Press: 1x6-9, 1x12-15",
//   "b": "Weighted Chin-Ups: 2x6-9",
//   "c": "Bench/Chest Press: 1x6-9, 1x12-15",
//   "d": "Lunges: 2x15-20",
//   "e": "DB Hammer Curls: 2x15-20",
//   "f": "Superset: Box Jumps 3x5 + Shuffle Hops 3x20-30"
// }

// b

// {
//   "a": "RDL: 1x6-9, 1x12-15",
//   "b": "Shoulder Press: 1x6-9, 1x12-15",
//   "c": "Powercleans: 3x3",
//   "d": "CG Lat Pulldown: 1x6-9, 1x12-15",
//   "e": "Preacher Curls: 2x15-20",
//   "f": "Tricep Ext: 2x15-20",
//   "g": "Deep Squat Jumps: 3x5"
// }
