/**
 * v0 by Vercel.
 * @see https://v0.dev/t/cMWxEGAEWn3
 */
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Icons } from "./icons";
import { Badge } from "./ui/badge";

interface Book {
  bookId: number;
  createdAt: Date;
  date: Date;
  title: string;
  type: string;
  author: string;
  description: string;
}

interface BookcardProps {
  book: Book;
}

interface BookclubProps {
  books?: Book[];
}

function getMonthName(dateString: Date) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthIdx = dateString.getUTCMonth(); // Get month index in UTC
  const year = dateString.getUTCFullYear();
  const result = { month: monthNames[monthIdx], year: year };
  return result;
}

export default function Bookclub({ books }: BookclubProps) {
  return (
    <div>
      {/* <main className="dark bg-gray-800 p-4 text-white md:p-6 lg:p-8"> */}
      <header className="mx-1 mb-4 md:mb-6 lg:mb-8">
        <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">Bookclub</h1>
        <p className="text-gray-400">
          Discover new books every 2-4 weeks from AG and the community.
          {/* Discover new books every 2-4 weeks. Mark the ones you&apos;ve read. */}
        </p>
      </header>
      <section className="flex flex-col items-center gap-4 md:gap-6 lg:gap-8">
        {books?.map((book) => <BookCard key={book.bookId} book={book} />)}
      </section>
      {/* </main> */}
    </div>
  );
}

const BookCard = ({ book }: BookcardProps) => (
  <Card className="w-full max-w-md">
    <CardHeader>
      <CardTitle>{book.title}</CardTitle>
      <CardDescription>By {book.author}</CardDescription>
    </CardHeader>
    <CardContent>{book.description}</CardContent>
    <CardFooter className="flex items-center justify-between">
      <div>
        <Badge variant="acid">
          <span>
            {getMonthName(book.date).month} {getMonthName(book.date).year}
          </span>
        </Badge>
        <Badge className="mx-2" variant="secondary">
          <span>
            {/* {getMonthName(book.date).month} {getMonthName(book.date).year} */}
            {book.type}
          </span>
        </Badge>
      </div>
      {/* <div className="flex items-center gap-2">
        <Icons.bookmark />
        <span>69</span>
      </div> */}
    </CardFooter>
  </Card>
);
