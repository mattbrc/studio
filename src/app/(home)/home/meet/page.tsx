import Link from "next/link";
import { ProfileForm } from "~/components/profile-form";
import { Button, buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/server";
import { currentUser } from "@clerk/nextjs/server";

export const metadata = {
  title: "Meet",
};

export default async function Page() {
  const user = await currentUser();
  const data = await api.profile.getUserProfile.query();

  return (
    <div className="container flex flex-col items-center justify-center px-4 py-6">
      <div className="h-[38rem] w-full md:w-1/2">
        <header className="mx-1 mb-4 md:mb-6 lg:mb-8">
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">Meet</h1>
          <p className="text-gray-400">
            Want to find other AG community members to train with near you?
          </p>
        </header>
        <div>
          {data ? (
            <Card>
              <CardHeader>
                <div className="flex flex-row justify-between">
                  <CardTitle>Your Profile</CardTitle>
                  {/* <Button>Edit Profile</Button> */}
                  {/* <ProfileForm action="edit" profile={data} /> */}
                  {/* <ProfileForm
                    action="edit"
                    profile={{
                      instagram: data.instagram ?? "",
                      city: data.city ?? "",
                      state: data.state ?? "",
                      goal: data.goal ?? "",
                      isPublic: data.isPublic,
                    }}
                  /> */}
                  <Link
                    href={`/home/user/${user?.id}`}
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Edit Profile
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  <p>IG: @{data.instagram}</p>
                  <p>
                    Location: {data.city}, {data.state}
                  </p>
                  <p>Public: {data.isPublic ? "Yes" : "No"}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex flex-row items-center justify-between">
                  <CardTitle>Your Profile</CardTitle>
                  <Link
                    href={`/home/user/${user?.id}`}
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Create Profile
                  </Link>
                </div>
              </CardHeader>
              <CardContent>You haven&apos;t set your profile yet.</CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
