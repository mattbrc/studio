import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

type WodData = Record<string, string>;
interface Workout {
  date: Date;
  createdAt: Date;
  wodId: number;
  title: string | null;
  strength: unknown;
  conditioning: unknown;
  program: string | null;
  notes: string | null;
}
interface WorkoutProps {
  data?: Workout;
  title: string;
}

interface RecapProps {
  data?: Workout[];
}

export function Recap({ data }: RecapProps) {
  if (!data)
    return (
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Workout of the Day</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p>No workouts available</p>
        </CardContent>
      </Card>
    );

  return (
    <div className="w-full md:w-1/2">
      <header className="mx-1 mb-4 md:mb-6 lg:mb-8">
        <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">Training</h1>
        <p className="text-gray-400">3-Day Recap of daily training</p>
      </header>
      <WodCard title="Tomorrow" data={data[0]} />
      <WodCard title="Today" data={data[1]} />
      <WodCard title="Yesterday" data={data[2]} />
    </div>
  );
}

const WodCard = ({ data, title }: WorkoutProps) => {
  const str: WodData = data?.strength as WodData;
  const cond: WodData = data?.conditioning as WodData;

  function formatUTCDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toUTCString().split(" ").slice(0, 4).join(" ");
  }

  if (!data)
    return (
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Workout of the Day</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p>No workouts available</p>
        </CardContent>
      </Card>
    );

  return (
    <Card className="mb-4 mt-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              {data?.date
                ? formatUTCDate(data.date.toUTCString())
                : "No date available"}
            </CardDescription>
            <CardDescription>10-Miler Prep</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="underline">{data?.title}</p>
        <p className="font-bold">Strength:</p>
        <span>
          <ul>
            {Object.entries(str).map(([key, value]) => (
              <li key={key}>{`${value}`}</li>
            ))}
          </ul>
        </span>
        <p className="mt-2 font-bold">Conditioning:</p>
        <span>
          <ul>
            {Object.entries(cond).map(([key, value]) => (
              <li key={key}>{`${value}`}</li>
            ))}
          </ul>
        </span>
        <CardDescription>{data?.notes}</CardDescription>
      </CardContent>
    </Card>
  );
};
