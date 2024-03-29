import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Progress } from "@/components/ui/progress";
import { api } from "~/trpc/server";
import { Badge } from "./ui/badge";

interface UserCardProps {
  id: string | undefined;
  username: string | null | undefined;
  title: string | undefined;
}

export async function UserCard({ ...props }: UserCardProps) {
  const count = await api.wod.getWodCount.query();
  const levelQuery = await api.wod.getLevel.query({ count });
  console.log("level query: ", levelQuery);
  console.log("level query: ", count);
  const level = levelQuery.level;
  const nextLevel = levelQuery.nextLevelWorkouts;
  const remaining = nextLevel - count;

  return (
    <Card {...props} className="w-full md:w-1/2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="pb-1">{props.username}</CardTitle>
            <div className="flex flex-row gap-2 pt-1">
              <Badge variant="acid">
                <span>{level}</span>
              </Badge>
              {props.title && (
                <Badge variant="secondary">
                  <span>{props.title}</span>
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="pb-2">Progress</p>
        <Progress
          value={
            ((count - levelQuery.requiredWorkouts) /
              (nextLevel - levelQuery.requiredWorkouts)) *
            100
          }
        />
        <CardDescription className="pt-2">
          Next Level: {remaining} remaining
        </CardDescription>
      </CardContent>
    </Card>
  );
}
