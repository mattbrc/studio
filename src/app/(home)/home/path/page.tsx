import Link from "next/link";

export const metadata = {
  title: "The Path",
};

export default function Page() {
  return (
    <div className="container flex flex-col items-center justify-center px-4 py-6">
      <div className="h-[38rem] w-full md:w-1/2">
        <header className="mx-1 mb-4 md:mb-6 lg:mb-8">
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            The Path
          </h1>
          <p className="pl-2 text-gray-400">Time to work</p>
        </header>
        <p>Welcome to the path. Are you ready to start?</p>
      </div>
    </div>
  );
}
