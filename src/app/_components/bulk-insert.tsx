"use client";

import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { wodData } from "~/lib/data/10-miler";
import { speed } from "~/lib/data/speed-1";

export function BulkInsert() {
  // insert into wods table
  // const mutation = api.wod.bulkInsertWods.useMutation();

  // insert into programWorkouts table
  const mutation = api.bulk.bulkInsertProgramWorkouts.useMutation();

  const handleInsert = () => {
    mutation.mutate(speed, {
      onSuccess: () => {
        console.log("success");
      },
      onError: (e) => {
        console.log("error: ", e);
      },
    });
  };

  return (
    <div className="container flex flex-col items-center justify-center gap-6 px-4 py-6">
      <Button onClick={handleInsert}>Click to insert</Button>
    </div>
  );
}
