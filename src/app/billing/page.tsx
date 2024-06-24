import { currentUser } from "@clerk/nextjs/server";
import { Icons } from "~/components/icons";
import StripeCheckout from "~/components/stripe-checkout";
import { StripeBillingPortal } from "~/components/stripe-checkout";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { api } from "~/trpc/server";

export const metadata = {
  title: "Billing",
};

const BillingDetails = async () => {
  const sub = await api.stripe.getSubscription.query();
  const user = await currentUser();
  console.log("user: ", user);
  return (
    <div className="max-w flex flex-col gap-4 md:w-1/2">
      {sub && (
        <Alert className="w-full">
          <Icons.check />
          <AlertTitle className="font-bold">
            You&apos;re subscribed to{" "}
            <span className="text-emerald-400">Studio Pro</span>
          </AlertTitle>
          <AlertDescription>Manage your subscription here.</AlertDescription>
          <div className="flex py-2">
            <StripeBillingPortal />
          </div>
        </Alert>
      )}
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
          {sub ? (
            <Button disabled={true} size="sm" variant="secondary">
              <span className="flex flex-row items-center gap-2">
                <p className="font-bold">Subscribe</p>
                <Icons.subscribeArrow size={20} />
              </span>
            </Button>
          ) : (
            // disabled to prevent users subscribing on test mode
            // <StripeCheckout priceId="price_1PSeLoL1iXnkfppRLdlyzZcT" />
            <Button disabled={true} size="sm" variant="secondary">
              <span className="flex flex-row items-center gap-2">
                <p className="font-bold">Subscribe</p>
                <Icons.subscribeArrow size={20} />
              </span>
            </Button>
          )}
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
          {sub ? (
            <Button disabled={true} size="sm" variant="secondary">
              <span className="flex flex-row items-center gap-2">
                <p className="font-bold">Subscribe</p>
                <Icons.subscribeArrow size={20} />
              </span>
            </Button>
          ) : (
            // disabled to prevent users subscribing on test mode
            // <StripeCheckout priceId="price_1PSeKqL1iXnkfppRzwPesskx" />
            <Button disabled={true} size="sm" variant="secondary">
              <span className="flex flex-row items-center gap-2">
                <p className="font-bold">Subscribe</p>
                <Icons.subscribeArrow size={20} />
              </span>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default function Page() {
  return (
    <div className="container flex flex-col items-center justify-center gap-6 px-4 py-6">
      <h1 className="text-2xl font-bold">Billing and Plans</h1>
      <BillingDetails />
    </div>
  );
}
