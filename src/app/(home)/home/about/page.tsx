import About from "~/components/about";

export const metadata = {
  title: "Studio - About",
};

export default function Page() {
  return (
    <div className="container h-[80vh] items-center justify-center px-4 py-6">
      <About />
    </div>
  );
}
