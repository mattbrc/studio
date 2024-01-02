import { CreatePost } from "~/app/_components/create-post";
import { api } from "~/trpc/server";
import { auth, currentUser } from "@clerk/nextjs";
import { UserCard } from "~/components/user-card";

export default async function Page() {
  const user = await currentUser();
  const userId = user?.id;
  const username = user?.username;
  const firstName = user?.firstName;
  const lastName = user?.lastName;

  return (
    // <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 text-white">
    <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16 ">
      <h1 className="text-2xl font-bold">Training Dashboard</h1>
      <UserCard
        id={userId}
        firstName={firstName}
        lastName={lastName}
        username={username}
      />
      <div>
        <p>user box</p>
        <p>user: {userId}</p>
        <p>name: {user?.firstName}</p>
        <p>current training program: ___</p>
        <p>workouts completed: ___</p>
        <p>edit profile button</p>
      </div>
      <div className="border border-red-400">
        <h1 className="text-2xl font-bold">Top Programs</h1>
        <p>AG Hybrid</p>
        <p>Speed</p>
        <p>Mil Prep</p>
        <CrudShowcase />
      </div>
    </div>
    // </main>
  );
}

async function CrudShowcase() {
  const data = await api.post.getAll.query();

  return (
    <div className="w-full max-w-xs">
      <div>
        {data?.map((post) => (
          <div key={post.id}>
            <p>{post.id}</p>
            <p>{post.name}</p>
          </div>
        ))}
      </div>

      {/* <CreatePost /> */}
    </div>
  );
}
