"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "./ui/button";
import { Icons } from "@/components/icons";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";

export default function StripeCheckout() {
  const router = useRouter();
  const [isSubmitLoading, setIsSubmitLoading] = React.useState<boolean>(false);

  const mutation = api.stripe.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      setIsSubmitLoading(false);
      if (data) {
        router.push(data);
      }
    },
    onError: (e) => {
      const errorCode = e.data?.code;
      if (errorCode === "CONFLICT") {
        console.log("e.message: ", e.data?.code);
        toast.error(e.message);
      } else {
        toast.error("Error, please try again later");
        console.log("e.message: ", e.data?.code);
      }
      setIsSubmitLoading(false);
    },
  });

  return (
    <Button
      disabled={isSubmitLoading}
      size="sm"
      variant="secondary"
      onClick={() => {
        setIsSubmitLoading(true);
        mutation.mutate();
      }}
    >
      <div>
        {isSubmitLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <span>Stripe checkout</span>
        )}
      </div>
    </Button>
  );
}
