import { Card, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { FaUserEdit } from "react-icons/fa";

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
  path?: boolean;
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
        <div className="flex justify-between">
          <div>
            <div className="flex flex-row items-start gap-2 pb-2">
              <CardTitle className="pb-1">{props.username}</CardTitle>
              {/* <Link href={`/home/user/${props.id}`}>
                <FaUserEdit className="h-4 w-4" />
              </Link> */}
            </div>
            <div className="flex flex-row gap-2 pt-1">
              {sub ? (
                <Badge variant="acid">Studio Pro</Badge>
              ) : (
                <Badge variant="secondary">Studio Free</Badge>
              )}
              {props.path && (
                <Badge variant="secondary">
                  <Link href="/home/path">The Path</Link>
                </Badge>
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
    </Card>
  );
}
