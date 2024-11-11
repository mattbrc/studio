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
import { z } from "zod";
import { Icons } from "~/components/icons";
import { toast } from "react-hot-toast";
import { api } from "~/trpc/react";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { StartPathProgram } from "./start-path-button";

const workoutSchema = z.object({
  orderId: z.number().int(),
  title: z.string(),
  strength: z.record(z.string()),
  conditioning: z.record(z.string()),
});

const programSchema = z.object({
  workouts: z.array(workoutSchema),
});

type PathProgram = z.infer<typeof programSchema>;

export function PathProgramForm({
  count,
  subscription,
}: {
  count: number;
  subscription: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [pathProgram, setPathProgram] = useState<PathProgram | null>(null);
  const [volume, setVolume] = useState<string>("Balanced");
  const [split, setSplit] = useState<string>("upper-lower");
  const [goal, setGoal] = useState<string>("hybrid");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const pathProgramRef = useRef<HTMLDivElement>(null);
  // const { data: latestPathPrograms, isLoading: isLoadingPathPrograms } =
  //   api.profile.getLatestPathPrograms.useQuery();
  // const [selectedPlanDate, setSelectedPlanDate] = useState<Date | null>(null);

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

  const generatePathMutation = api.ai.generatePathProgram.useMutation({
    onSuccess: (data) => {
      setPathProgram(data.pathProgram);
      toast.success("Path program generated successfully");
      console.log(data.pathProgram);
      console.log(data.generationId);
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
      console.log("Generating path program...");
      await generatePathMutation.mutateAsync({
        split,
        goal,
        volume,
        instructions: additionalInstructions,
      });
      console.log("path generated successfully");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mb-4 space-y-4">
        {count !== undefined && (
          <div className="flex items-center gap-2">
            <Icons.alert className="text-emerald-400" />
            <p className="text-sm text-muted-foreground">
              {100 - count}/100 programs remaining this month.
            </p>
          </div>
        )}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold">The Path v1</h2>
            <p className="text-sm text-muted-foreground">
              The Path is a custom program built specifically for your goals.
            </p>
          </div>
          <h3 className="font-semibold">Quick Options</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="volume" className="block text-sm font-medium">
                Training Volume
              </label>
              <Select onValueChange={setVolume} defaultValue={volume}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Balanced" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Balanced">Balanced</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Savage">Savage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="goal" className="block text-sm font-medium">
                Program Type
              </label>
              <Select onValueChange={setGoal} defaultValue={goal}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Hybrid" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="vo2-max-hrv">
                    VO2 Max + HRV Focused (aerobic)
                  </SelectItem>
                  <SelectItem value="speed">Speed (1-5 Miler)</SelectItem>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="marathon">Half/Full Marathon</SelectItem>
                  <SelectItem value="milprep">MilPrep</SelectItem>
                  <SelectItem value="acft">ACFT</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* <div className="space-y-2">
              <label htmlFor="phase" className="block text-sm font-medium">
                Block Phase
              </label>
              <Select onValueChange={setPhase} defaultValue={phase}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="1" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
            <div className="space-y-2">
              <label htmlFor="split" className="block text-sm font-medium">
                Lifting Split
              </label>
              <Select onValueChange={setSplit} defaultValue={split}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Upper/Lower" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upper-lower">Upper/Lower</SelectItem>
                  <SelectItem value="ppl">
                    Push/Pull/Legs (bro split)
                  </SelectItem>
                  <SelectItem value="full-body">Full Body</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="additionalInstructions"
              className="block text-sm font-medium"
            >
              Additional Instructions (optional)
            </label>
            <Input
              id="additionalInstructions"
              placeholder="E.g., No rucking, no barbell access, no machine access, etc."
              value={additionalInstructions}
              onChange={handleAdditionalInstructionsChange}
              className="w-full text-base"
              maxLength={300}
            />
            {inputError && (
              <p className="text-sm text-destructive">{inputError}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {additionalInstructions.length}/300 characters
            </p>
          </div>
        </div>
      </div>
      {subscription ? (
        <div className="flex flex-col gap-4">
          <Button
            onClick={onSubmit}
            disabled={loading || !!inputError || count === 100}
            className="w-full sm:w-48"
          >
            {loading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Path Program"
            )}
          </Button>
          {/* {!isLoadingPathPrograms &&
            latestPathPrograms &&
            latestPathPrograms.length > 0 && (
              <div>
                <h3 className="mb-2 text-lg font-semibold">
                  Previous Programs Built
                </h3>
                <Select
                  onValueChange={(value) => {
                    const selectedPlan = latestPathPrograms.find(
                      (plan) => plan.id.toString() === value,
                    );
                    if (selectedPlan) {
                      setPathProgram(selectedPlan.program as PathProgram);
                      setSelectedPlanDate(new Date(selectedPlan.generatedAt));
                    }
                  }}
                >
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Select a previous meal plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {latestPathPrograms.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id.toString()}>
                        Plan from {new Date(plan.generatedAt).toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )} */}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2 pb-2">
            <Icons.alert className="text-red-400" />
            <p className="text-sm font-bold">
              You&apos;re on the free plan! Upgrade to use The Path.
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

      {pathProgram && (
        <div ref={pathProgramRef} className="mt-8 space-y-4">
          <h2 className="mb-1 text-xl font-semibold">Path Program:</h2>
          {/* <Button className="w-full" variant="acid">
            Set as Active Program
          </Button> */}
          <StartPathProgram pathId={generatePathMutation.data?.generationId} />
          <div className="space-y-6 rounded-lg bg-muted p-4 text-sm">
            <p className="text-muted-foreground">Preview (7 days)</p>
            {pathProgram.workouts.slice(0, 7).map((workout, index) => (
              <div key={index} className="space-y-2">
                <h3>
                  <span className="font-semibold">Day {index + 1}: </span>
                  {workout.title}
                </h3>

                <div className="space-y-1">
                  <p className="font-medium text-muted-foreground">Strength:</p>
                  {Object.entries(workout.strength).map(([key, value], i) => (
                    <p key={i}>{value}</p>
                  ))}
                </div>

                <div className="space-y-1">
                  <p className="font-medium text-muted-foreground">
                    Conditioning:
                  </p>
                  {Object.entries(workout.conditioning).map(
                    ([key, value], i) => (
                      <p key={i}>{value}</p>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
