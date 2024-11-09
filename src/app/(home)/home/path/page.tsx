import Link from "next/link";
import { Icons } from "~/components/icons";
import { MealPlanForm } from "~/components/meal-plan-form";
import { PathProgramForm } from "~/components/path-form";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";

export default async function MealPlanPage() {
  const { count } = await api.ai.getPathGenerationsCount.query();
  const sub = await api.stripe.getSubscription.query();
  let subscription = false;
  if (sub) {
    subscription = true;
  }

  return (
    <div className="container mx-auto py-8 md:w-3/4">
      <PathProgramForm count={count} subscription={subscription} />
    </div>
  );
}
