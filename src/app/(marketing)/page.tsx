import Link from "next/link";
import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";

import { currentUser, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { sql } from "drizzle-orm";
import { workoutsLog } from "~/server/db/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default async function Home() {
  /**
          ___   ______________     _________    __  _______  __________
          /   | / ____/  _/ __ \   / ____/   |  /  |/  / __ )/  _/_  __/
          / /| |/ /    / // / / /  / / __/ /| | / /|_/ / __  |/ /  / /   
        / ___ / /____/ // /_/ /  / /_/ / ___ |/ /  / / /_/ // /  / /    
        /_/  |_\____/___/_____/   \____/_/  |_/_/  /_/_____/___/ /_/     
                                                                          
   
        https://patorjk.com/software/taag/#p=display&f=Slant&t=ACID%20GAMBIT
        */
  const user = await currentUser();
  const { userId } = auth();
  const count = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(workoutsLog);
  console.log("count: ", count[0]?.count);

  if (userId) {
    redirect("/home");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16 font-mono">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="text-[hsl(161,78%,58%)]">AG</span> Studio
        </h1>
        <p className="py-2 text-center text-xl">
          The official ACIDGAMBIT training app
        </p>
        {/* <p className="text-center text-sm">
          aka The Acid Gambit Center for Kids Who Can&apos;t Read Good and Who
          Wanna Learn to Do Other Stuff Good Too
        </p> */}
        {user ? (
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "px-4",
            )}
          >
            Enter
          </Link>
        ) : (
          <Link
            href="/sign-in"
            className={cn(buttonVariants({ variant: "secondary" }), "px-4")}
          >
            Enter
          </Link>
        )}
        {count[0]?.count && (
          <Card className="mx-8">
            <CardContent>
              <CardHeader>
                <CardTitle className="font-sm text-center">
                  Total workouts completed by the community:
                </CardTitle>
                {/* <CardDescription>Card Description</CardDescription> */}
              </CardHeader>
              <p className="text-center font-bold text-[hsl(161,78%,58%)]">
                {count[0].count}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
