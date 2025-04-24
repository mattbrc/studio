import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

// Type specifically for the mock data structure in speed1.ts
type WodData = Record<string, string>;

export interface TrainWorkout {
  orderId?: number;
  title: string | null;
  strength: WodData | null;
  conditioning: WodData | null;
  programId?: number;
}

interface TrainWorkoutCardProps {
  data: TrainWorkout;
  orderId?: number;
}

export const TrainWorkoutCard: React.FC<TrainWorkoutCardProps> = ({
  data,
  orderId,
}) => {
  const str = data.strength ?? {};
  const cond = data.conditioning ?? {};

  let titleDisplay = data.title ?? "Workout";
  let descriptionDisplay = data.title;

  if (orderId !== undefined) {
    const weekNumber = Math.floor(orderId / 7) + 1;
    const dayNumber = (orderId % 7) + 1;
    titleDisplay = `Week ${weekNumber} Day ${dayNumber}`;
    descriptionDisplay = data.title ?? null;
  } else {
    // Fallback if orderId is not provided
    descriptionDisplay = null;
  }

  // Determine if it's a rest day or has no content
  const isStrengthRest = Object.keys(str).length === 0 || str.a === "Rest";
  const isConditioningRest =
    Object.keys(cond).length === 0 || cond.a === "Rest"; // Only consider "Rest" as explicitly no conditioning

  const isRestDay = isStrengthRest && isConditioningRest;

  const hasStrength = Object.keys(str).length > 0 && !isStrengthRest;
  const hasConditioning = Object.keys(cond).length > 0 && !isConditioningRest;

  return (
    <Card className="mb-4 w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="underline">{titleDisplay}</CardTitle>
            {descriptionDisplay && (
              <CardDescription className="pt-1">
                {descriptionDisplay}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {hasStrength && (
          <>
            <p className="font-bold">Strength:</p>
            <ul>
              {Object.entries(str).map(([key, value]) => (
                <li key={key}>{value}</li>
              ))}
            </ul>
          </>
        )}

        {hasConditioning && (
          <>
            <p className={`font-bold ${hasStrength ? "mt-2" : ""}`}>
              Conditioning:
            </p>
            <ul>
              {Object.entries(cond).map(([key, value]) => (
                <li key={key}>{value}</li>
              ))}
            </ul>
          </>
        )}

        {isRestDay && !hasStrength && !hasConditioning && (
          <p className="mt-2 font-semibold">Rest Day</p>
        )}
      </CardContent>
    </Card>
  );
};
