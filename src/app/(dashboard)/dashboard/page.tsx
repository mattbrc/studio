import { currentUser } from "@clerk/nextjs";
import { UserCard } from "~/components/user-card";
import { Wod } from "~/components/wod";

export default async function Page() {
  const user = await currentUser();
  const userId = user?.id;
  const username = user?.username;
  const firstName = user?.firstName;
  const lastName = user?.lastName;

  return (
    <div className="container flex flex-col items-center justify-center gap-6 px-4 py-6">
      <h1 className="text-2xl font-bold">Training Dashboard</h1>
      <UserCard
        id={userId}
        firstName={firstName}
        lastName={lastName}
        username={username}
      />
      <Wod />
    </div>
  );
}
