import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";
import Link from "next/link";

export function ResourcesCard() {
  return (
    <Card className="w-full md:w-1/2">
      <CardHeader>
        <div>
          <CardTitle className="pb-1">Resources</CardTitle>
          <CardDescription>More from ACID GAMBIT</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 items-center justify-center gap-4">
          <Link
            href="https://acidgambit.substack.com/"
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "px-4",
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Writing
          </Link>
          <Link
            href="https://app.cal.com/acidgambit/30min"
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "px-4",
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Coaching
          </Link>

          <Link
            href="https://discord.gg/W4x3Eej95q"
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "px-4",
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord
          </Link>
          <Link
            href="https://acidgambit.gumroad.com/"
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "px-4",
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Shop
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
