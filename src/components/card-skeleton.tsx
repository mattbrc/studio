import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CardSkeleton() {
  return (
    <Card className="w-full md:w-1/2">
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-1/5" />
        <Skeleton className="h-3 w-2/5" />
      </CardHeader>
      <CardContent className="h-10" />
      <CardFooter>
        <Skeleton className="h-2 w-full" />
      </CardFooter>
    </Card>
  );
}
