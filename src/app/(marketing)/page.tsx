import Link from "next/link";
import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";

import { currentUser, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();
  const { userId } = auth();

  if (userId) {
    redirect("/home");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center px-4 py-16 font-mono">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="text-[hsl(161,78%,58%)]">AG</span> Studio
        </h1>
        <p className="text-center text-xl">
          The official ACIDGAMBIT training app
        </p>
        {/* <p className="text-center">
          This app is primarily for three types of people. If you fall in these
          categories, proceed:
        </p>
        <ul className="">
          <li>You want to BECOME an athlete</li>
          <li>You want to IMPROVE as an athlete</li>
          <li>
            You want to improve as a TACTICAL athlete (this includes SOF/MIL,
            Firefighters, LEOs, and First Responders)
          </li>
        </ul> */}
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
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "px-4",
            )}
          >
            Enter
          </Link>
        )}
      </div>
    </main>
  );
}
