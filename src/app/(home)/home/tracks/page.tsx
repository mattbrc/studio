import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import Tracks from "~/components/tracks";
import { api } from "~/trpc/server";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

export const metadata = {
  title: "Programs",
};

export default async function Page() {
  const sub = await api.stripe.getSubscription.query();
  const tracks = await api.wod.getAllTracks.query();
  const trackWorkouts = await api.wod.getLatestTrackWorkouts.query();

  console.log("track workouts: ", trackWorkouts);

  return (
    <div className="container flex flex-col items-center justify-center px-4 py-6">
      {sub ? (
        <Tracks workouts={trackWorkouts} />
      ) : (
        <div className="w-full md:w-1/2">
          <header className="mx-1 mb-4 md:mb-6 lg:mb-8">
            <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
              Tracks
            </h1>
            <p className="text-gray-400">View or start a new program</p>
          </header>
          <Alert className="w-full">
            <Icons.alert />
            <AlertTitle className="font-bold">
              You&apos;re on the free plan!
            </AlertTitle>
            <AlertDescription>
              Upgrade now to get full access to all daily track workouts.
            </AlertDescription>
            <div className="flex py-2">
              <Link href="/billing">
                <Button>Upgrade</Button>
              </Link>
            </div>
          </Alert>
          <div>
            <p className="pt-4 text-xl font-bold">Tracks Showcase</p>
            {tracks ? (
              <div>
                {tracks.map((track) => (
                  <TrackCard key={track.trackId} track={track} />
                ))}
              </div>
            ) : (
              <div>No programs available</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface Track {
  trackId: number;
  createdAt: Date;
  title: string;
  description: string;
  active: boolean;
}

interface TrainingCardProps {
  track?: Track;
}

const TrackCard = ({ track }: TrainingCardProps) => {
  if (!track)
    return (
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Error. Currently unavailable</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p>Try again later...</p>
        </CardContent>
      </Card>
    );

  return (
    <Card className="mb-4 mt-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            {/* <CardTitle>{track.title}</CardTitle> */}
            <Badge variant="acid">{track.title}</Badge>
            {/* <CardDescription>Duration: {track.length}</CardDescription> */}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p>{track.description}</p>
      </CardContent>
    </Card>
  );
};
