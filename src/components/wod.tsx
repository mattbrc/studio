import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { api } from "~/trpc/server";
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

// Use the interface in a component
interface WorkoutProps {
  data?: Workout; // The '?' makes 'workout' optional
}

export function Wod({ data }: WorkoutProps) {
  // const data = await api.wod.getLatest.query();

  const str: WodData = data?.strength as WodData;
  const cond: WodData = data?.conditioning as WodData;
  console.log("rendering");

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
          </div>
          <WodOperations workoutId={data?.wodId} />
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
        <p className="font-bold">Conditioning:</p>
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
