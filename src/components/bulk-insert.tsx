"use client";

import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

// import { data } from "~/lib/data/track_workouts";

// import { data } from "~/lib/data/ranger";

// import { data } from "~/lib/data/return";

// use for daily wod insertions

// import { data } from "~/lib/data/studio_wod";

import { data } from "~/lib/data/newyear";

// import { data } from "~/lib/data/murph_savage";

import toast from "react-hot-toast";

export function BulkInsert() {
  // insert into wods table
  // const mutation = api.bulk.bulkInsertWods.useMutation();

  // insert into programWorkouts table
  const mutation = api.bulk.bulkInsertProgramWorkouts.useMutation();

  // insert into tracks table
  // const mutation = api.bulk.bulkInsertTracks.useMutation();

  const handleInsert = () => {
    mutation.mutate(data, {
      onSuccess: () => {
        console.log("success");
        // Revalidate the programs cache
        void fetch("/api/revalidate?tag=programs");
        toast.success("Inserted");
      },
      onError: (e) => {
        console.log("error: ", e);
        toast.error("Failed to insert");
      },
    });
  };

  return (
    <div className="container flex flex-col items-center justify-center gap-6 px-4 py-6">
      <Button onClick={handleInsert}>Click to insert</Button>
    </div>
  );
}
