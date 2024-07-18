"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";

interface Workout {
  title: string | null;
  date: Date;
  createdAt: Date;
  workoutId: number;
  strength: unknown;
  conditioning: unknown;
  trackId: number;
}

interface TracksProps {
  workouts: Workout[];
}

export default function Tracks({ workouts }: TracksProps) {
  const [selectedWorkoutType, setSelectedWorkoutType] = useState("Hybrid");

  const handleWorkoutTypeChange = (value: string) => {
    setSelectedWorkoutType(value);
  };

  function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  }

  const workoutDate = new Date();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Workout Tracks</h1>
        <p className="text-gray-400">Select a track.</p>
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

      <div>
        {selectedWorkoutType === "Hybrid" && (
          <>
            <TrackWorkoutCard
              data={workouts[0]}
              track="Hybrid"
              date={formatDate(workoutDate)}
            />
          </>
        )}
        {selectedWorkoutType === "Strength" && (
          <>
            <TrackWorkoutCard
              data={workouts[1]}
              track="Strength"
              date={formatDate(workoutDate)}
            />
          </>
        )}
        {selectedWorkoutType === "Speed + Endurance" && (
          <>
            <TrackWorkoutCard
              data={workouts[2]}
              track="Speed + Endurance"
              date={formatDate(workoutDate)}
            />
          </>
        )}
      </div>
    </div>
  );
}

type WodData = Record<string, string>;

interface WorkoutProps {
  data: Workout | undefined;
  track: string;
  date: string;
}

const TrackWorkoutCard: React.FC<WorkoutProps> = ({ data, track, date }) => {
  if (!data) {
    return <p>No workout data available.</p>;
  }

  const str: WodData = data.strength as WodData;
  const cond: WodData = data.conditioning as WodData;

  return (
    <Card className="mb-4 w-full">
      <CardHeader>
        <div className="relative flex items-center justify-between">
          <div>
            <CardTitle className="underline">{date}</CardTitle>
            <CardDescription className="pt-1">{data?.title}</CardDescription>
          </div>
          <Badge className="absolute right-0 top-0" variant="acid">
            {track}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-bold">Strength:</p>
        <span>
          <ul>
            {Object.entries(str).map(([key, value]) => (
              <li key={key}>{`${value}`}</li>
            ))}
          </ul>
        </span>

        <p className="mt-2 font-bold">Conditioning:</p>
        <span>
          <ul>
            {Object.entries(cond).map(([key, value]) => (
              <li key={key}>{`${value}`}</li>
            ))}
          </ul>
        </span>
      </CardContent>
    </Card>
  );
};
