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

export function Wod() {
  return (
    <Card className="w-full md:w-1/2">
      <CardHeader>
        <CardTitle>Workout of the Day</CardTitle>
        <CardDescription>Todays Date</CardDescription>
      </CardHeader>
      <CardContent>
        <p>workout name</p>
        <CardDescription>workout details</CardDescription>
      </CardContent>
    </Card>
  );
}
