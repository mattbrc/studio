import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { api } from "~/trpc/server";
import { cn } from "~/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { WodOperations } from "./wod-operations";

type WodData = Record<string, string>;

export async function Wod() {
  const data = await api.wod.getLatest.query();

  const wod: WodData = data?.workout as WodData;

  function formatUTCDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toUTCString().split(" ").slice(0, 4).join(" ");
  }

  if (!data)
    return (
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <CardTitle>Workout of the Day</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <CardDescription>No workout available.</CardDescription>
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
          {/* <WodOperations /> */}
          {/* <Link
            href=""
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "px-4",
            )}
          >
            Complete Workout
          </Link> */}
        </div>
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
