"use client";

import toast from "react-hot-toast";
import { Button } from "./ui/button";

export function Toast() {
  const notify = () => toast.success("Well done! Workout Completed.");
  return <Button onClick={notify}>Submit</Button>;
}
