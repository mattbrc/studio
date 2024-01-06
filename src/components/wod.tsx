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

export async function Wod() {
  const data = await api.wod.getLatest.query();

  const wod: WodData = data?.workout as WodData;

  function formatUTCDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toUTCString().split(" ").slice(0, 4).join(" ");
  }

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
        <span>
          <ul>
            {Object.entries(wod).map(([key, value]) => (
              <li key={key}>{`${value}`}</li>
            ))}
          </ul>
        </span>
        <CardDescription>{data?.notes}</CardDescription>
      </CardContent>
    </Card>
  );
}
