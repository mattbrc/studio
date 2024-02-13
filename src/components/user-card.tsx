import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Progress } from "@/components/ui/progress";
import { api } from "~/trpc/server";
import { Badge } from "./ui/badge";

interface UserCardProps {
  id: string | undefined;
  username: string | null | undefined;
}

export async function UserCard({ ...props }: UserCardProps) {
  const count = await api.wod.getWodCount.query();
  const levelQuery = await api.wod.getLevel.query({ count });
  const userProgram = await api.wod.getUserProgram.query();
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
              {userProgram && (
                <Badge variant="secondary">
                  <span>{userProgram?.program?.title}</span>
                </Badge>
              )}
            </div>
          </div>
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
    </Card>
  );
}
