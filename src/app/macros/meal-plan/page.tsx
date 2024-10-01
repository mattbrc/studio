import Link from "next/link";
import { Icons } from "~/components/icons";
import { MealPlanForm } from "~/components/meal-plan-form";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";

export default async function MealPlanPage() {
  const { count, limit, remaining } =
    await api.ai.getMealPlanGenerationsCount.query();
  const sub = await api.stripe.getSubscription.query();
  const tdee = await api.profile.getUserTDEE.query();
  let subscription = false;
  if (sub) {
    subscription = true;
  }

  const weight = 70; // Assuming a default weight for demonstration

  return (
    <MealPlanForm
      count={count}
      subscription={subscription}
      tdee={tdee}
      weight={weight}
    />
  );
}
