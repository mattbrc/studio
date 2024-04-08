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
            <p>
              We have a unique approach to training. It&apos;s not one that
              should be uncommon. But rare to find individuals today that are
              able to move their bodies well, lift multiples of their
              bodyweight, and rapidly recover for the next day.
            </p>
            <p>
              The unique blend of training required to achieve this is what
              creates these daily rituals.
            </p>
            <p>
              Daily rituals that turn into weeks. And months, then years. That
              then reflect in our physiques, our performance, and approach to
              life.
            </p>

            <p>
              There&apos;s plenty of places to find &quot;workouts&quot;. But AG
              has grown into a community of like-minded individuals seeking
              more. Join us as we build out this app and continue to seek
              perfection (we never will but it&apos;s the thought that counts).
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
