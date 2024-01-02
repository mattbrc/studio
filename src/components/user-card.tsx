import type { User } from "@clerk/nextjs/dist/types/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Progress } from "@/components/ui/progress";

interface UserCardProps {
  id: string | undefined;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  username: string | null | undefined;
}

export function UserCard({ ...props }: UserCardProps) {
  return (
    <Card {...props} className="w-full md:w-1/2">
      <CardHeader>
        <CardTitle>{props.username}</CardTitle>
        <CardDescription>Level 1 (cult novice)</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="pb-2">Progress</p>
        <Progress value={10} />
        <CardDescription className="pt-2">
          Next Level: 9 remaining workouts
        </CardDescription>
      </CardContent>
      <CardFooter>
        <p>Active Program: None</p>
      </CardFooter>
    </Card>
  );
}
