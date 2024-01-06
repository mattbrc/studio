import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { api } from "~/trpc/server";

interface UserCardProps {
  id: string | undefined;
  username: string | null | undefined;
}

export async function UserCard({ ...props }: UserCardProps) {
  const count = await api.wod.getWodCount.query();
  const levelQuery = await api.wod.getLevel.query({ count });
  const level = levelQuery.level;
  const nextLevel = levelQuery.nextLevelWorkouts;
  const remaining = nextLevel - count;

  return (
    <Card {...props} className="w-full md:w-1/2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="pb-1">{props.username}</CardTitle>
            <CardDescription>{props.id}</CardDescription>
          </div>
          {/* <Link
            href=""
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "px-4",
            )}
          >
            Profile
          </Link> */}
        </div>
      </CardHeader>
      <CardContent>
        <p className="pb-2">Progress</p>
        <Progress
          value={((count - levelQuery.requiredWorkouts) / nextLevel) * 100}
        />
        <CardDescription className="pt-2">
          Next Level: {remaining} remaining workouts
        </CardDescription>
      </CardContent>
      {/* <CardFooter>
        <p>Active Program: None</p>
      </CardFooter> */}
    </Card>
  );
}
