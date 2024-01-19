import { CardSkeleton } from "~/components/card-skeleton";

export default function DashboardLoading() {
  return (
    <div className="container flex flex-col items-center justify-center gap-6 px-4 py-6">
      <CardSkeleton />
      {/* <UserCard id={user?.id} username={user?.username} />
      <Wod />
      <ResourcesCard /> */}
    </div>
  );
}
