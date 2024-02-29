import Link from "next/link";
import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";

import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { sql } from "drizzle-orm";
import { workoutsLog } from "~/server/db/schema";
import { Separator } from "~/components/ui/separator";

export default async function Home() {
  /**
          ___   ______________     _________    __  _______  __________
          /   | / ____/  _/ __ \   / ____/   |  /  |/  / __ )/  _/_  __/
          / /| |/ /    / // / / /  / / __/ /| | / /|_/ / __  |/ /  / /   
        / ___ / /____/ // /_/ /  / /_/ / ___ |/ /  / / /_/ // /  / /    
        /_/  |_\____/___/_____/   \____/_/  |_/_/  /_/_____/___/ /_/     
                                                                          
   
        https://patorjk.com/software/taag/#p=display&f=Slant&t=ACID%20GAMBIT
        */
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
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          {/* <Link
            href={siteConfig.links.instagram}
            className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
            target="_blank"
          >
            Follow along on Instagram
          </Link> */}
          {count[0]?.count && (
            <div className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium">
              <p className="">
                Workouts completed:{" "}
                <span className="text-center font-bold text-[hsl(161,78%,58%)]">
                  {count[0].count}
                </span>
              </p>
            </div>
          )}
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            <span className="text-[hsl(161,78%,58%)]">AG</span> Studio
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            The official ACIDGAMBIT training app.
          </p>
          <div className="space-x-4">
            <Link
              href="/sign-in"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
      <div className="container">
        <Separator />
      </div>

      {/* <section
        id="features"
        className="container space-y-6 py-8 dark:bg-transparent md:py-12 lg:py-24"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">
            Features
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            This project is an experiment to see how a modern app, with features
            like auth, subscriptions, API routes, and static pages would work in
            Next.js 13 app dir.
          </p>
        </div>
      </section> */}
    </>
  );
}
