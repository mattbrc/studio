import { api } from "~/trpc/server";

export const metadata = {
  title: "Training History",
};

export default function Page() {
  return (
    <div className="container flex flex-col items-center justify-center px-4 py-6">
      <p>History</p>
    </div>
  );
}
