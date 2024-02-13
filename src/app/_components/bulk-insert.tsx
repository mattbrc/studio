"use client";

import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export function BulkInsert() {
  const wodData = [
    {
      date: new Date("2024-02-15"),
      title: "W4D4",
      strength: {
        a: "RDL: 1x6-9, 1x12-15",
        b: "Powercleans: 3x3",
        c: "Deep Squat Jumps: 3x5",
        d: "Shoulder Press: 1x6-9, 1x12-15",
        e: "CG Lat Pulldown: 1x6-9, 1x12-15",
        f: "Preacher Curls: 2x15-20",
        g: "Tricep Ext: 2x15-20",
      },
      conditioning: { a: "None" },
      program: "",
      notes: "",
    },
    {
      date: new Date("2024-02-16"),
      title: "W4D5",
      strength: { a: "None" },
      conditioning: { a: "4-5 miles easy" },
      program: "",
      notes: "",
    },
    {
      date: new Date("2024-02-17"),
      title: "W4D6",
      strength: { a: "None" },
      conditioning: { a: "12-14 miles easy" },
      program: "",
      notes: "",
    },
    {
      date: new Date("2024-02-18"),
      title: "W4D7",
      strength: { a: "None" },
      conditioning: { a: "None" },
      program: "",
      notes: "",
    },
  ];

  const mutation = api.wod.bulkInsertWods.useMutation();

  const handleInsert = () => {
    mutation.mutate(wodData, {
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
