import type { User } from "@clerk/nextjs/dist/types/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface UserCardProps {
  id: string | undefined;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  username: string | null | undefined;
}

export function UserCard({ ...props }: UserCardProps) {
  return (
    <Card {...props} className="w-full">
      <CardHeader>
        <CardTitle>{props.username}</CardTitle>
        <CardDescription>
          {props.firstName} {props.lastName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}
