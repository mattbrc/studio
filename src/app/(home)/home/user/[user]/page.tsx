import { ProfileForm } from "~/components/profile-form";
import { api } from "~/trpc/server";

export const metadata = {
  title: "User Profile",
};

export default async function Page() {
  const data = await api.profile.getUserProfile.query();

  return (
    <div className="container flex flex-col items-center justify-center px-4 py-6">
      <div className="w-full md:w-2/3 lg:w-1/2">
        <header className="mx-1 mb-4 md:mb-6 lg:mb-8">
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            Profile
          </h1>
          <p className="text-gray-400">Edit your profile here.</p>
        </header>
        {data ? (
          <ProfileForm
            action="edit"
            profile={{
              instagram: data.instagram ?? "",
              city: data.city ?? "",
              state: data.state ?? "",
              goal: data.goal ?? "",
              isPublic: data.isPublic,
            }}
          />
        ) : (
          <ProfileForm action="create" />
        )}
      </div>
    </div>
  );
}
