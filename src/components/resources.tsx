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

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
          {/* <Link
            href="https://acidgambit.gumroad.com/"
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "px-4",
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Whoop Team
          </Link> */}
          <WhoopButton />
          <Link
            href="https://strava.app.link/bGuqx7kFuGb"
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "px-4",
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Strava Run Club
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function WhoopButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          Whoop Team
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Whoop Team Code</DialogTitle>
          <DialogDescription>
            Code: <span className="font-bold text-white">COMM-FA1355</span>
          </DialogDescription>
          <DialogDescription>
            In the whoop app, go to the communities tab -&gt; Teams -&gt; 3 Dots
            -&gt; Enter invite code
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
