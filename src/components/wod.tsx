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
            <CardTitle>{data?.title}</CardTitle>
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
        {/* <p className="underline">{data?.title}</p> */}
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
