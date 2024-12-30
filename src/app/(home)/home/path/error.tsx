"use client";

import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Icons } from "~/components/icons";

export default function PathError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center">
      <div className="mx-auto flex max-w-xl flex-col items-center space-y-4 text-center">
        <Icons.alert className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold">Path Program Error</h2>
        <p className="text-muted-foreground">
          There was an error generating or loading your path program. This could
          be due to a temporary issue.
        </p>
        <div className="flex gap-2">
          {/* <Button onClick={() => reset()} variant="default">
            Try again
          </Button> */}
          <Button
            onClick={() => (window.location.href = "/home")}
            variant="outline"
          >
            Go to dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
