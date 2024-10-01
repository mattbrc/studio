"use client";

import { useState, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import jsPDF from "jspdf";
import { z } from "zod";
import { Icons } from "~/components/icons";
import { toast } from "react-hot-toast";
import { api } from "~/trpc/react";
import Link from "next/link";
import { calculateMacros } from "~/lib/macroCalculations";

const mealSchema = z.object({
  name: z.string(),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
});

const mealPlanSchema = z.object({
  meals: z.array(mealSchema),
  totalCalories: z.number(),
  totalProtein: z.number(),
  totalCarbs: z.number(),
  totalFat: z.number(),
});

type MealPlan = z.infer<typeof mealPlanSchema>;

// Add this type if it's not already defined
type StoredMealPlan = {
  id: number;
  userId: string;
  generatedAt: Date;
  mealPlan: MealPlan;
};

export function MealPlanForm({
  count,
  subscription,
  tdee,
  weight,
}: {
  count: number;
  subscription: boolean;
  tdee: number | null;
  weight: number | null;
}) {
  const [loading, setLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [numberOfMeals, setNumberOfMeals] = useState<string>("4");
  const [goal, setGoal] = useState<string>("Maintenance");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const mealPlanRef = useRef<HTMLDivElement>(null);
  const { data: latestMealPlans, isLoading: isLoadingMealPlans } =
    api.profile.getLatestMealPlans.useQuery();
  const [selectedPlanDate, setSelectedPlanDate] = useState<Date | null>(null);

  const handleAdditionalInstructionsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    if (value.length <= 300) {
      setAdditionalInstructions(value);
      setInputError(null);
    } else {
      setInputError("Additional instructions must be 300 characters or less.");
    }
  };

  const generateMealPlanMutation = api.ai.generateMealPlan.useMutation({
    onSuccess: (data) => {
      setMealPlan(data.mealPlan);
      toast.success("Meal plan generated successfully");
    },
    onError: (error) => {
      console.error("Error:", error);
      if (error.message.includes("TOO_MANY_REQUESTS")) {
        toast.error("Rate limit exceeded. Please try again shortly.");
      } else if (error.message.includes("LIMIT")) {
        toast.error(
          "You have reached the maximum number of meal plans for this month.",
        );
      } else {
        // toast.error(error.message);
        toast.error("Failed to generate meal plan. Please try again shortly.");
      }
    },
  });

  async function onSubmit() {
    setLoading(true);
    try {
      if (!tdee || !weight) {
        throw new Error("TDEE or weight is missing");
      }

      const macros = calculateMacros(
        tdee,
        weight,
        goal as "Maintenance" | "Cutting" | "Bulking",
      );

      await generateMealPlanMutation.mutateAsync({
        tdee: macros.calories,
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat,
        meals: parseInt(numberOfMeals, 10),
        instructions: additionalInstructions,
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  const exportToPDF = () => {
    if (!mealPlanRef.current || !mealPlan) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yOffset = margin;

    const addNewPageIfNeeded = (height: number) => {
      if (yOffset + height > pageHeight - margin) {
        doc.addPage();
        yOffset = margin;
        return true;
      }
      return false;
    };

    const writeText = (text: string, fontSize: number, isBold: boolean) => {
      doc.setFontSize(fontSize);
      if (isBold) doc.setFont("bold");
      else doc.setFont("normal");

      const lines = doc.splitTextToSize(
        text,
        pageWidth - 2 * margin,
      ) as string[];
      lines.forEach((line) => {
        addNewPageIfNeeded(7);
        doc.text(line, margin, yOffset);
        yOffset += 4;
      });
      yOffset += 3; // Add some space after each text block
    };

    // Add logo to top right corner of first page
    doc.addImage("/circle_ag_logo.png", "PNG", pageWidth - 60, 10, 50, 50);

    // Title
    writeText("Acid Gambit Meal Plan", 16, true);

    mealPlan.meals.forEach((meal, index) => {
      addNewPageIfNeeded(20);
      writeText(`Meal ${index + 1}: ${meal.name}`, 14, true);
      writeText(`Calories: ${meal.calories}`, 12, false);
      writeText(`Protein: ${meal.protein}g`, 12, false);
      writeText(`Carbs: ${meal.carbs}g`, 12, false);
      writeText(`Fat: ${meal.fat}g`, 12, false);

      writeText("Ingredients:", 12, true);
      meal.ingredients.forEach((ingredient) => {
        writeText(`• ${ingredient}`, 10, false);
      });

      writeText("Instructions:", 12, true);
      meal.instructions.forEach((instruction, i) => {
        writeText(`${i + 1}. ${instruction}`, 10, false);
      });

      yOffset += 10; // Add extra space between meals
    });

    // Daily Totals
    addNewPageIfNeeded(40);
    writeText("Daily Totals:", 14, true);
    writeText(`Total Calories: ${mealPlan.totalCalories}`, 12, false);
    writeText(`Total Protein: ${mealPlan.totalProtein}g`, 12, false);
    writeText(`Total Carbs: ${mealPlan.totalCarbs}g`, 12, false);
    writeText(`Total Fat: ${mealPlan.totalFat}g`, 12, false);

    // Instead of saving, let's create a blob and open it
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Create a link and trigger the download
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "meal-plan.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    URL.revokeObjectURL(pdfUrl);
  };

  return (
    <>
      <div className="mb-4 flex flex-col gap-2">
        {count !== undefined && (
          <div className="flex flex-row items-center gap-2 pb-2">
            <Icons.alert className="text-emerald-400" />
            <p className="text-sm text-muted-foreground">
              {100 - count}/100 meal plans remaining this month.
            </p>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <p className="font-bold">Quick Options</p>
          <div className="flex flex-row items-center gap-2 py-2">
            <label htmlFor="meals">Meals/day</label>
            <Select
              onValueChange={setNumberOfMeals}
              defaultValue={numberOfMeals}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select meals" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 Meals</SelectItem>
                <SelectItem value="3">3 Meals</SelectItem>
                <SelectItem value="4">4 Meals</SelectItem>
                <SelectItem value="5">5 Meals</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-row items-center gap-2 py-2">
            <label htmlFor="goal">Goal</label>
            <Select onValueChange={setGoal} defaultValue={goal}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Maintenance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Bulking">Bulking</SelectItem>
                <SelectItem value="Cutting">Cutting</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="additionalInstructions">
              Additional Instructions (optional)
            </label>
            <div>
              <Input
                id="additionalInstructions"
                placeholder="E.g., No milk, I don't want elite dog food, etc."
                value={additionalInstructions}
                onChange={handleAdditionalInstructionsChange}
                className="w-full text-base"
                maxLength={300}
              />
              {inputError && (
                <p className="text-sm text-destructive">{inputError}</p>
              )}
              <p className="px-2 text-sm text-muted-foreground">
                {additionalInstructions.length}/300 characters
              </p>
            </div>
          </div>
        </div>
      </div>
      {subscription ? (
        <div className="flex flex-col gap-4">
          <Button
            onClick={onSubmit}
            disabled={loading || !!inputError || count === 100}
            className="w-48"
          >
            {loading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Meal Plan"
            )}
          </Button>

          {!isLoadingMealPlans &&
            latestMealPlans &&
            latestMealPlans.length > 0 && (
              <div>
                <h3 className="mb-2 text-lg font-semibold">
                  Previous Meal Plans
                </h3>
                <Select
                  onValueChange={(value) => {
                    const selectedPlan = latestMealPlans.find(
                      (plan) => plan.id.toString() === value,
                    );
                    if (selectedPlan) {
                      setMealPlan(selectedPlan.mealPlan as MealPlan);
                      setSelectedPlanDate(new Date(selectedPlan.generatedAt));
                    }
                  }}
                >
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Select a previous meal plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {latestMealPlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id.toString()}>
                        Plan from {new Date(plan.generatedAt).toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2 pb-2">
            <Icons.alert className="text-red-400" />
            <p className="text-sm font-bold">
              You&apos;re on the free plan! Upgrade to use meal plans.
            </p>
          </div>
          <Link href="/billing">
            <Button className="w-48">Upgrade</Button>
          </Link>
        </div>
      )}
      {loading && (
        <div className="mt-4 rounded-lg border border-destructive p-4">
          <div className="flex flex-row items-center gap-2">
            <Icons.alert className="text-destructive" />
            <p>Generating...</p>
          </div>
          <p>Please do not leave this page. This can take up to 30 seconds.</p>
        </div>
      )}

      {mealPlan && (
        <>
          <div ref={mealPlanRef} className="mt-8">
            <h2 className="mb-1 text-xl font-semibold">Meal Plan:</h2>
            {selectedPlanDate && (
              <p className="mb-4 text-sm text-muted-foreground">
                Generated on: {selectedPlanDate.toLocaleString()}
              </p>
            )}
            <div className="space-y-6">
              {mealPlan.meals.map((meal, index) => (
                <div key={index} className="rounded-lg border p-4">
                  <h3 className="mb-2 text-lg font-medium underline">
                    Meal {index + 1}: {meal.name}
                  </h3>
                  <p>Calories: {meal.calories}</p>
                  <p>Protein: {meal.protein}g</p>
                  <p>Carbs: {meal.carbs}g</p>
                  <p>Fat: {meal.fat}g</p>
                  <h4 className="mt-2 font-medium">Ingredients:</h4>
                  <ul className="list-inside list-disc">
                    {meal.ingredients.map((ingredient, i) => (
                      <li key={i}>{ingredient}</li>
                    ))}
                  </ul>
                  <h4 className="mt-2 font-medium">Instructions:</h4>
                  <ol className="list-inside list-decimal">
                    {meal.instructions.map((instruction, i) => (
                      <li key={i}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Daily Totals:</h3>
              <p>Total Calories: {mealPlan.totalCalories}</p>
              <p>Total Protein: {mealPlan.totalProtein}g</p>
              <p>Total Carbs: {mealPlan.totalCarbs}g</p>
              <p>Total Fat: {mealPlan.totalFat}g</p>
            </div>
          </div>
          <Button onClick={exportToPDF} className="mt-4">
            Export to PDF
          </Button>
        </>
      )}
    </>
  );
}
