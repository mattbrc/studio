import Bookclub from "~/components/bookclub";
import { api } from "~/trpc/server";

export const metadata = {
  title: "Studio - Bookclub",
};

export default async function Page() {
  const books = await api.book.getAll.query();
  console.log("books: ", books);

  return (
    <div className="container flex flex-col items-center justify-center px-4 py-6">
      <Bookclub books={books} />
    </div>
  );
}
