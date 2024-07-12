import { Icons } from "~/components/icons";
import { Programs } from "~/components/programs";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { api } from "~/trpc/server";
import Link from "next/link";
import { ProgramShowcase } from "~/components/program-showcase";

export const metadata = {
  title: "Program Details",
};

interface Program {
  programId: number;
}

export default function Page({ params }: { params: Program }) {
  // const programs = await api.wod.getAllPrograms.query();
  // const userProgramDetails = await api.wod.getUserWorkouts.query();
  // const sub = await api.stripe.getSubscription.query();

  return (
    <div>
      <p>program details</p>
      <p>{params.programId}</p>
    </div>
  );
}
