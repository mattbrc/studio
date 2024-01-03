import { CreatePost } from "~/app/_components/create-post";
import { api } from "~/trpc/server";
import { auth, currentUser } from "@clerk/nextjs";
import { UserCard } from "~/components/user-card";
import { UserProfile } from "@clerk/nextjs";
import Link from "next/link";
import { Wod } from "~/components/wod";

export default async function Page() {
  const user = await currentUser();
  const userId = user?.id;
  const username = user?.username;
  const firstName = user?.firstName;
  const lastName = user?.lastName;

  return (
    // <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 text-white">
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
    // </main>
  );
}

async function WodShowcase() {
  // const data = await api.post.getAll.query();
  const data = await api.wod.getLatest.query();

  return (
    <div className="w-full max-w-xs">
      <div>
        {/* {data?.map((post) => (
          <div key={post.id}>
            <p>{post.id}</p>
            <p>{post.name}</p>
          </div>
        ))} */}
      </div>

      {/* <CreatePost /> */}
    </div>
  );
}
