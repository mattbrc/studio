import Pricing from "~/components/pricing";

export const metadata = {
  title: "Studio - Pricing",
};

export default function Page() {
  return (
    <div className="container h-[80vh] w-full items-center justify-center px-4 py-6 md:w-1/2">
      <Pricing />
    </div>
  );
}
