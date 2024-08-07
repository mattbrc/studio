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
import { Button } from "./ui/button";
import Link from "next/link";

interface Subscription {
  userId: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  stripePriceId: string;
  stripeCurrentPeriodEnd: number;
}
interface UserCardProps {
  id: string | undefined;
  username: string | null | undefined;
  title: string | undefined;
  subscription: Subscription | null;
}

export function UserCard({ ...props }: UserCardProps) {
  // const count = await api.wod.getWodCount.query();
  // const levelQuery = await api.wod.getLevel.query({ count });
  const sub = props.subscription;
  // const level = levelQuery.level;
  // const nextLevel = levelQuery.nextLevelWorkouts;
  // const remaining = nextLevel - count;

  return (
    <Card {...props} className="w-full md:w-1/2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="pb-1">{props.username}</CardTitle>
            <div className="flex flex-row gap-2 pt-1">
              {sub ? (
                <Badge variant="acid">Studio Pro</Badge>
              ) : (
                <Badge variant="secondary">Studio Free</Badge>
              )}
              {props.title && (
                <Badge variant="secondary">
                  <Link href="/home/programs">{props.title}</Link>
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      {/* <CardContent>
        <p className="">Progress</p>
        <CardDescription className="pb-1">
          Next Level: {remaining} remaining
        </CardDescription>
        <Progress
          value={
            ((count - levelQuery.requiredWorkouts) /
              (nextLevel - levelQuery.requiredWorkouts)) *
            100
          }
        />
        <Badge className="mt-2" variant="acid">
          <span>{level}</span>
        </Badge>
      </CardContent> */}
    </Card>
  );
}
