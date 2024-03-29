import { Wod } from "~/components/wod";
import { api } from "~/trpc/server";

export const metadata = {
  title: "Studio - Home",
};

export default async function Page() {
  const data = await api.wod.getLatest.query();

  return (
    <div className="container flex flex-col items-center justify-center gap-6 px-4 py-6">
      <h1 className="text-2xl font-bold">Workout of the Day</h1>
      <Wod data={data} />
    </div>
  );
}
