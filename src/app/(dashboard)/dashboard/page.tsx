import { CreatePost } from "~/app/_components/create-post";
import { api } from "~/trpc/server";

export default function Page() {
  return (
    // <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 text-white">
    <div className="container flex flex-col items-center justify-center gap-6 border border-red-400 px-4 py-16 ">
      <h1 className="text-2xl font-bold">Training Dashboard</h1>
      <div className="border border-red-400">
        <p>user box</p>
        <p>current training program: ___</p>
        <p>workouts completed: ___</p>
        <p>edit profile button</p>
        <p className="italic">app.acidgambit.com/u/acidgambit</p>
      </div>
      <div className="border border-red-400">
        <h1 className="text-2xl font-bold">Top Programs</h1>
        <p>AG Hybrid</p>
        <p>Speed</p>
        <p>Mil Prep</p>
      </div>
      <CrudShowcase />
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

      <CreatePost />
    </div>
  );
}
