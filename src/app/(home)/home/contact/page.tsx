import Link from "next/link";

export const metadata = {
  title: "Contact",
};

export default function Page() {
  return (
    <div className="container flex flex-col items-center justify-center px-4 py-6">
      <div className="h-[38rem] w-full md:w-1/2">
        <header className="mx-1 mb-4 md:mb-6 lg:mb-8">
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            Contact
          </h1>
          <p className="text-gray-400">Need help or have questions?</p>
        </header>
        <p>
          Reach out directly via email to{" "}
          <span className="underline underline-offset-2">
            director@acidgambit.com
          </span>
        </p>
        <p className="pt-2">
          Or hit us up on instagram @{" "}
          <Link
            className="underline underline-offset-2"
            href="https://instagram.com/acidgambit"
            target="_blank"
            rel="noopener noreferrer"
          >
            acidgambit
          </Link>
        </p>
      </div>
    </div>
  );
}
