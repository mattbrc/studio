import { BulkInsert } from "~/app/_components/bulk-insert";
import StripeCheckout from "~/components/stripe-checkout";

export default function Page() {
  return (
    <div className="container flex flex-col items-center justify-center gap-6 px-4 py-6">
      <h1 className="text-2xl font-bold">Insert Page</h1>
      <StripeCheckout />
      <BulkInsert />
    </div>
  );
}
