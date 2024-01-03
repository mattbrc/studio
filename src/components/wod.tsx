import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { api } from "~/trpc/server";

type WodData = Record<string, string>;

export async function Wod() {
  const data = await api.wod.getLatest.query();

  const wod: WodData = data?.workout as WodData;

  return (
    <Card className="w-full md:w-1/2">
      <CardHeader>
        <CardTitle>Workout of the Day</CardTitle>
        <CardDescription>
          {data?.date ? data.date.toLocaleDateString() : "No date available"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{data?.title}</p>
        <span>
          <ul>
            {Object.entries(wod).map(([key, value]) => (
              <li key={key}>{`${key}: ${value}`}</li>
            ))}
          </ul>
        </span>
        <CardDescription>{data?.notes}</CardDescription>
      </CardContent>
    </Card>
  );
}
