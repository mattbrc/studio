"use client";

import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Icons } from "~/components/icons";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log to error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto flex max-w-xl flex-col items-center space-y-4 text-center">
        <Icons.alert className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-muted-foreground">
          We apologize for the inconvenience. Please try again or contact
          support if the problem persists.
        </p>
        <div className="flex gap-2">
          {/* <Button onClick={() => reset()} variant="default">
            Try again
          </Button> */}
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
