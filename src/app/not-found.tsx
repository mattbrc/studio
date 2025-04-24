import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <h2 className="text-4xl font-bold">Page Not Found</h2>
      <p className="text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Button variant="acid" asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
