import { WeeklyTrainingView } from "~/components/weekly-training-view";

export const metadata = {
  title: "Train",
};

export default function TrainPage() {
  return (
    <div className="container flex flex-col items-center justify-center gap-4 py-4">
      <h1 className="mb-4 text-3xl font-bold">Training Plan</h1>
      <WeeklyTrainingView />
    </div>
  );
}
