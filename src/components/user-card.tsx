import type { User } from "@clerk/nextjs/dist/types/server";
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="pb-1">{props.username}</CardTitle>
            <CardDescription>Level 1 (cult novice)</CardDescription>
          </div>
          <Link
            href=""
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "px-4",
            )}
          >
            Profile
          </Link>
        </div>
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
