import Link from "next/link";
import { Icons } from "~/components/icons";
import { MealPlanForm } from "~/components/meal-plan-form";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";

export default async function Page() {
  const { count, limit, remaining } =
    await api.ai.getMealPlanGenerationsCount.query();
  const sub = await api.stripe.getSubscription.query();
  let subscription = false;
  if (sub) {
    subscription = true;
  }

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Meal Plan Generator</h1>

      <MealPlanForm count={count} subscription={subscription} />
    </>
  );
}
