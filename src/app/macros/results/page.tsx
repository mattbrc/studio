"use client";

import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IoMdAlert } from "react-icons/io";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@clerk/nextjs";
import { calculateMacros } from "~/lib/helpers";

export default function Page() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const age = searchParams.get("age");
  const weight = Number(searchParams.get("weight"));
  const height = searchParams.get("height");
  const gender = searchParams.get("gender");
  const activityFactor = searchParams.get("activityFactor");
  const bmr = searchParams.get("bmr");
  const tdee = Number(searchParams.get("tdee"));

  const maintenanceMacros = calculateMacros(tdee, weight, "Maintenance");
  const cuttingMacros = calculateMacros(tdee, weight, "Cutting");
  const bulkingMacros = calculateMacros(tdee, weight, "Bulking");

  const requiredParams = [
    { name: "Age", value: age },
    { name: "Weight", value: weight },
    { name: "Height", value: height },
    { name: "Gender", value: gender },
    { name: "Activity Level", value: activityFactor },
    { name: "BMR", value: bmr },
    { name: "TDEE", value: tdee },
  ];

  const activityFactors = [
    { name: "Sedentary", value: "1.2" },
    { name: "Light Exercise (1-2x/week)", value: "1.375" },
    { name: "Moderate Exercise (3-5x/week)", value: "1.55" },
    { name: "Heavy Exercise (6-7x/week)", value: "1.725" },
    { name: "Athlete (2x/day)", value: "1.9" },
  ];

  const missingParams = requiredParams.filter((param) => !param.value);

  if (missingParams.length > 0) {
    return (
      <div>
        <Alert variant="destructive">
          <IoMdAlert className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            The following required parameters are missing:
            <ul className="mt-2 list-inside list-disc">
              {missingParams.map((param) => (
                <li key={param.name}>{param.name}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
        <div className="flex flex-col gap-2 py-4">
          <p className="text-center text-sm text-muted-foreground">
            Please go back and fill out all required fields.
          </p>
          <Button asChild variant="acid">
            <Link href="/macros">Recalculate Macros</Link>
          </Button>
        </div>
      </div>
    );
  }

  // all params exist
  return (
    <div className="mx-auto flex w-full flex-col gap-4 md:w-2/3">
      <h1 className="text-2xl font-bold">Your Stats</h1>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <p>
          Age: <span className="font-bold">{age}</span>
        </p>
        <p>
          Weight: <span className="font-bold">{weight}</span>
        </p>
        <p>
          Height: <span className="font-bold">{height}</span>
        </p>
        <p>
          Gender: <span className="font-bold">{gender}</span>
        </p>
        <p>
          Activity:{" "}
          <span className="font-bold">
            {
              activityFactors.find((factor) => factor.value === activityFactor)
                ?.name
            }
          </span>
        </p>
      </div>
      <Separator />
      <p className="text-center font-bold">Your Maintenance Calories</p>
      <div className="flex flex-col gap-2 rounded-lg bg-zinc-300 p-4 text-background">
        <p>Basal Metabolic Rate (BMR)</p>
        <p className="text-xl font-bold">{bmr} Calories per day</p>
        <Separator />
        <p>Total Daily Energy Expenditure (TDEE)</p>
        <p className="text-xl font-bold">{tdee} Calories per day</p>
      </div>
      <div className="pt-2">
        <Separator />
      </div>
      {/* <p className="text-center font-bold">Recommended Macros</p>
      <div className="flex flex-col gap-2 rounded-lg bg-zinc-300 p-4 text-background">
        <p>Basal Metabolic Rate (BMR)</p>
        <p className="text-xl font-bold">{bmr} Calories per day</p>
        <Separator />
        <p>Total Daily Energy Expenditure (TDEE)</p>
        <p className="text-xl font-bold">{tdee} Calories per day</p>
      </div> */}

      <Tabs defaultValue="Maintenance">
        <div className="flex justify-center">
          <TabsList className="inline-flex px-2">
            <TabsTrigger value="Maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="Cutting">Cutting</TabsTrigger>
            <TabsTrigger value="Bulking">Bulking</TabsTrigger>
          </TabsList>
        </div>
        {/* Maintenance */}
        <TabsContent value="Maintenance">
          <p className="px-1 pb-2">
            Recommended Macros based on maintenance calories of{" "}
            <span className="font-bold">{tdee}</span> Calories per day.
          </p>
          <div className="flex flex-col gap-2 rounded-lg bg-zinc-300 p-4 text-background">
            <p>Total Daily Energy Expenditure (TDEE)</p>
            <p className="text-xl font-bold">{tdee} Calories per day</p>
            <Separator />
            <div className="flex flex-row justify-between px-2">
              <div>
                <p className="text-xl font-bold">
                  {maintenanceMacros.protein}g
                </p>
                <p className="text-sm">
                  Protein (
                  {Math.round(((maintenanceMacros.protein * 4) / tdee) * 100)}%)
                </p>
              </div>
              <div>
                <p className="text-xl font-bold">{maintenanceMacros.carbs}g</p>
                <p className="text-sm">
                  Carbs (
                  {Math.round(((maintenanceMacros.carbs * 4) / tdee) * 100)}
                  %)
                </p>
              </div>
              <div>
                <p className="text-xl font-bold">{maintenanceMacros.fat}g</p>
                <p className="text-sm">Fat ({0.32 * 100}%)</p>
              </div>
            </div>
          </div>
        </TabsContent>
        {/* Cutting */}
        <TabsContent value="Cutting">
          <p className="px-1 pb-2">
            Recommended Macros based on a 500 calorie deficit of{" "}
            <span className="font-bold">{Number(tdee) - 500}</span> Calories per
            day.
          </p>
          <div className="flex flex-col gap-2 rounded-lg bg-zinc-300 p-4 text-background">
            <p>Total Daily Energy Expenditure (TDEE)</p>
            <p className="text-xl font-bold">
              {Number(tdee) - 500} Calories per day
            </p>
            <Separator />
            <div className="flex flex-row justify-between px-2">
              <div>
                <p className="text-xl font-bold">{cuttingMacros.protein}g</p>
                <p className="text-sm">
                  Protein (
                  {Math.round(
                    ((cuttingMacros.protein * 4) / (tdee - 500)) * 100,
                  )}
                  %)
                </p>
              </div>
              <div>
                <p className="text-xl font-bold">{cuttingMacros.carbs}g</p>
                <p className="text-sm">
                  Carbs (
                  {Math.round(((cuttingMacros.carbs * 4) / (tdee - 500)) * 100)}
                  %)
                </p>
              </div>
              <div>
                <p className="text-xl font-bold">{cuttingMacros.fat}g</p>
                <p className="text-sm">Fat ({0.32 * 100}%)</p>
              </div>
            </div>
          </div>
        </TabsContent>
        {/* Bulking */}
        <TabsContent value="Bulking">
          <p className="px-1 pb-2">
            Recommended Macros based on a 500 calorie surplus of{" "}
            <span className="font-bold">{Number(tdee) + 500}</span> Calories per
            day.
          </p>
          <div className="flex flex-col gap-2 rounded-lg bg-zinc-300 p-4 text-background">
            <p>Total Daily Energy Expenditure (TDEE)</p>
            <p className="text-xl font-bold">
              {Number(tdee) + 500} Calories per day
            </p>
            <Separator />
            <div className="flex flex-row justify-between px-2">
              <div>
                <p className="text-xl font-bold">{bulkingMacros.protein}g</p>
                <p className="text-sm">
                  Protein (
                  {Math.round(
                    ((bulkingMacros.protein * 4) / (tdee + 500)) * 100,
                  )}
                  %)
                </p>
              </div>
              <div>
                <p className="text-xl font-bold">{bulkingMacros.carbs}g</p>
                <p className="text-sm">
                  Carbs (
                  {Math.round(((bulkingMacros.carbs * 4) / (tdee + 500)) * 100)}
                  %)
                </p>
              </div>
              <div>
                <p className="text-xl font-bold">{bulkingMacros.fat}g</p>
                <p className="text-sm">Fat ({0.32 * 100}%)</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <div className="flex justify-center pt-2">
        {user ? (
          <Button asChild variant="acid">
            <Link href="/macros/meal-plan">Generate a Meal Plan</Link>
          </Button>
        ) : (
          <Button asChild variant="acid">
            <Link href="/sign-in">Generate a Meal Plan</Link>
          </Button>
        )}
      </div>
      <div className="pt-2">
        <Separator />
      </div>
      <h1 className="text-center text-2xl font-bold">Methods</h1>
      <div className="flex flex-col gap-2 text-sm">
        <p className="font-bold underline">Note:</p>
        <p>
          The values calculated here are estimates and should be used as a
          starting point for your diet. The best way to determine your true TDEE
          is to use this as a starting point, track for 1-2 weeks and monitor
          your weight. If you are hitting your goal (lose weight, maintain, gain
          weight), change nothing. But if you are not hitting your goal, adapt
          your TDEE by 250-500 calories at a time (add/subtrack based on goal)
          and measure for another 1-2 weeks. Repeat as necessary. Additionally,
          you are welcome to adapt the macro breakdown to your needs. This
          calculation uses 1.1g/pound of BW, 32% fat, and roughly 40% carbs,
          however it will vary based on your input.
        </p>
        <p>
          <span className="font-bold">Basal Metabolic Rate (BMR)</span> is the
          energy expended by an individual at rest (when fasted and at
          thermoneutral temperature), as a result of normal cell and organ
          function within the body, and accounts for approximately 60–75% of
          total daily energy expenditure in individuals with a sedentary
          occupation.{" "}
          <Link
            className="text-emerald-400 underline"
            href="https://www.sciencedirect.com/topics/medicine-and-dentistry/basal-metabolic-rate#:~:text=Basal%20metabolic%20rate%20is%20the,individuals%20with%20a%20sedentary%20occupation."
          >
            Source
          </Link>
        </p>
        <p>
          BMR is calculated using the Mifflin St. Jeor equation, the most recent
          and most accurate method of calculating BMR:
        </p>
        <p>Men: BMR = 10W + 6.25H - 5A + 5</p>
        <p>Women: BMR = 10W + 6.25H - 5A - 161</p>
        <p>
          <span className="font-bold">
            Total Daily Energy Expenditure (TDEE)
          </span>{" "}
          is the total number of calories that your body expends in 24 hours,
          including all activities. This includes the sum of BMR, non-exercise
          activity thermogenesis (NEAT, like walking up stairs), and exercise
          activity thermogenesis (EAT, like lifting weights or running).{" "}
          <Link
            className="text-emerald-400 underline"
            href="https://www.k-state.edu/paccats/Contents/PA/PDF/Physical%20Activity%20and%20Controlling%20Weight.pdf"
          >
            Source
          </Link>
        </p>
        <p>
          To calculate your TDEE we multiply your BMR by widely recognized
          activity factors:
        </p>
        <ul className="list-inside list-disc">
          <li>Sedentary: 1.2</li>
          <li>Light Exercise (1-2x/week): 1.375</li>
          <li>Moderate Exercise (3-5x/week): 1.55</li>
          <li>Heavy Exercise (6-7x/week): 1.725</li>
          <li>Athlete (2x/day): 1.9</li>
        </ul>
      </div>
      <Separator />
      <p className="text-center font-bold">Made it this far?</p>
      <p>
        You should probably start working out. Get off your couch. Or leave work
        - the call can wait. Tell your wife there&apos;s weights to move. Miles
        to run. Places to be (getting bigger, faster, stronger).
      </p>
      <p>Whatever you do...</p>

      <p>Don&apos;t be a loser ↓</p>

      <div className="flex justify-center">
        <Button asChild variant="acid">
          <Link href="https://app.acidgambit.com">Start Training</Link>
        </Button>
      </div>
    </div>
  );
}
