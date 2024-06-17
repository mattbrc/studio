import { Icons } from "~/components/icons";
import StripeCheckout from "~/components/stripe-checkout";
import { StripeBillingPortal } from "~/components/stripe-checkout";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { api } from "~/trpc/server";

export const metadata = {
  title: "Studio - Home",
};

const BillingDetails = () => {
  return (
    <div className="max-w flex flex-col gap-4 md:w-1/2">
      {/* Annual Card */}
      <Card className="border border-emerald-500">
        <CardHeader>
          <div>
            <Badge variant="acid">Best Value</Badge>
          </div>
          <h2 className="text-xl font-bold">Studio Pro</h2>
          <div className="flex flex-row gap-2">
            <p className="text-5xl font-bold">$12</p>
            <div className="flex flex-col">
              <CardDescription>
                2 months free, $144 billed annually
              </CardDescription>
              <p>Per Month</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul>
            <li>
              <div className="flex flex-row items-center gap-2">
                <Icons.check />
                Access to all programs
              </div>
            </li>
            <li>
              <div className="flex flex-row items-center gap-2">
                <Icons.check />
                Access to all WODs
              </div>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <StripeCheckout priceId="price_1PSeLoL1iXnkfppRLdlyzZcT" />
        </CardFooter>
      </Card>
      {/* Monthly Card */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Studio Pro</h2>
          <div className="flex flex-row gap-2">
            <p className="text-5xl font-bold">$15</p>
            <div className="flex flex-col">
              <CardDescription>$15 billed monthly</CardDescription>
              <p>Per Month</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul>
            <li>
              <div className="flex flex-row items-center gap-2">
                <Icons.check />
                Access to all programs
              </div>
            </li>
            <li>
              <div className="flex flex-row items-center gap-2">
                <Icons.check />
                Access to all WODs
              </div>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <StripeCheckout priceId="price_1PSeKqL1iXnkfppRzwPesskx" />
        </CardFooter>
      </Card>
    </div>
  );
};

export default async function Page() {
  const sub = await api.stripe.getSubscription.query();

  return (
    <div className="container flex flex-col items-center justify-center gap-6 px-4 py-6">
      <h1 className="text-2xl font-bold">Billing and Plans</h1>
      <BillingDetails />
      <StripeBillingPortal />
    </div>
  );
}
