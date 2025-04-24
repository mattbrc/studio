"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { TrainWorkoutCard, type TrainWorkout } from "./train-workout-card"; // Use the new card
import { data as mockWorkouts } from "~/lib/data/free-training";

const WORKOUTS_PER_WEEK = 7;

export function WeeklyTrainingView() {
  const [selectedWeekIndex, setSelectedWeekIndex] = React.useState(0);

  const totalWeeks = Math.ceil(mockWorkouts.length / WORKOUTS_PER_WEEK);

  const startIdx = selectedWeekIndex * WORKOUTS_PER_WEEK;
  const endIdx = startIdx + WORKOUTS_PER_WEEK;
  const currentWeekWorkouts = mockWorkouts.slice(startIdx, endIdx);

  const handleWeekChange = (value: string) => {
    setSelectedWeekIndex(parseInt(value, 10));
  };

  return (
    <div className="w-full md:w-3/4 lg:w-1/2">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Select Week</h2>
        {totalWeeks > 1 && (
          <Select
            onValueChange={handleWeekChange}
            defaultValue={selectedWeekIndex.toString()}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Week" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: totalWeeks }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  Week {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {currentWeekWorkouts.length > 0 ? (
        currentWeekWorkouts.map((workout, index) => (
          <TrainWorkoutCard
            key={startIdx + index}
            data={workout as unknown as TrainWorkout} // Cast needed for mock data
            orderId={startIdx + index} // Pass global index
          />
        ))
      ) : (
        <p>No workouts found for this week.</p>
      )}
    </div>
  );
}
