"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import * as React from "react";

export function MarketingCard() {
  return (
    <div>
      <Card className="mx-2 mt-20 max-w-[375px] bg-zinc-800 sm:max-w-[500px]">
        <CardHeader>
          <CardTitle>Our lives are shaped by our daily rituals.</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2">
            <p>Find commonality with the uncommon.</p>
            <p>
              AG is a community of like-minded individuals seeking more:
              completing daily rituals to be able to move our bodies well, lift
              multiples of our bodyweight, and rapidly recover for the next day.
            </p>
            <p>
              The unique blend of training required to achieve this is what
              creates these daily rituals.
            </p>
            <p>
              Each ritual is a day that turn into weeks, months, then years.
              This reflects in our physiques, our performance, and approach to
              life.
            </p>

            <p>
              There&apos;s plenty of places to find &quot;workouts&quot;. But AG
              is for those seeking more. Join us.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <div className="font-mono text-sm text-gray-400">
            <p>2024 ACID GAMBIT</p>
            <p>Washington D.C., USA</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
