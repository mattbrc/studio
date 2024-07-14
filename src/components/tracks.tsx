/**
 * v0 by Vercel.
 * @see https://v0.dev/t/TmHcWXPaXpy
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

// import * as React, { useState } from "react"
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Tracks() {
  const [selectedWorkoutType, setSelectedWorkoutType] = useState("Hybrid");
  const handleWorkoutTypeChange = (value: string) => {
    setSelectedWorkoutType(value);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Workout Tracks</h1>
        <p className="text-gray-400">Select a track and start your workout.</p>
      </div>
      <div className="mb-8 flex items-center justify-center gap-4">
        <p>Current Track:</p>
        <Select
          value={selectedWorkoutType}
          onValueChange={handleWorkoutTypeChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue>{selectedWorkoutType}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Hybrid">Hybrid</SelectItem>
            <SelectItem value="Strength">Strength</SelectItem>
            <SelectItem value="Speed + Endurance">Speed + Endurance</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedWorkoutType === "Hybrid" && (
              <>
                <p>hybrid</p>
              </>
            )}
            {selectedWorkoutType === "Strength" && (
              <>
                <p>strength</p>
              </>
            )}
            {selectedWorkoutType === "Speed + Endurance" && (
              <>
                <p>endurance</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
