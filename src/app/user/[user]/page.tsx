export default function Page({ params }: { params: { userId: string } }) {
  return <div>User Page: {params.userId}</div>;
}
