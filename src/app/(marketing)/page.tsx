import Link from "next/link";
import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Icons } from "~/components/icons";
import { MarketingCard } from "~/components/marketing-card";

export default function Home() {
  /**
    ___   ______________     _________    __  _______  __________
    /   | / ____/  _/ __ \   / ____/   |  /  |/  / __ )/  _/_  __/
    / /| |/ /    / // / / /  / / __/ /| | / /|_/ / __  |/ /  / /   
  / ___ / /____/ // /_/ /  / /_/ / ___ |/ /  / / /_/ // /  / /    
  /_/  |_\____/___/_____/   \____/_/  |_/_/  /_/_____/___/ /_/     
                                                                    

  https://patorjk.com/software/taag/#p=display&f=Slant&t=ACID%20GAMBIT
  */
  const { userId } = auth();

  if (userId) {
    redirect("/home");
  }

  return (
    <>
      <section className="flex h-screen snap-start flex-col justify-between overflow-hidden">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <p className="text-3xl font-extrabold tracking-tight sm:text-[3rem]">
            Something must be{" "}
            <span className="text-[hsl(161,78%,58%)]">done.</span>
          </p>
          <p className="pb-2 font-mono">
            This is a fitness app. Let&apos;s train.
          </p>
          <Link
            href="/sign-in"
            className={cn(buttonVariants({ variant: "acid" }), "px-4")}
          >
            Sign In
          </Link>
        </div>

        <div className="container flex max-w-[64rem] flex-col items-center gap-2 pb-24 text-center">
          {/* Content at the bottom */}
          <p className="font-mono">Our Story</p>
          <Icons.arrow />
        </div>
      </section>

      <section className="flex h-screen snap-start items-center justify-center overflow-hidden">
        <MarketingCard />
      </section>
    </>
  );
}
