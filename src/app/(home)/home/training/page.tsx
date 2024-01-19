import { Recap } from "~/components/recap";
import { api } from "~/trpc/server";

export const metadata = {
  title: "Studio - Training",
};

export default async function Page() {
  const recap = await api.wod.getRecap.query();

  return (
    <div className="container flex flex-col items-center justify-center px-4 py-6">
      <Recap data={recap} />
    </div>
  );
}
