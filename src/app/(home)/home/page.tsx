import { currentUser } from "@clerk/nextjs";
import { ResourcesCard } from "~/components/resources";
import { UserCard } from "~/components/user-card";
import { Wod } from "~/components/wod";
import { api } from "~/trpc/server";

export default async function Page() {
  const user = await currentUser();
  const data = await api.wod.getLatest.query();

  return (
    <div className="container flex flex-col items-center justify-center gap-6 px-4 py-6">
      <h1 className="text-2xl font-bold">Home</h1>
      <UserCard id={user?.id} username={user?.username} />
      <Wod data={data} />
      <ResourcesCard />
    </div>
  );
}
