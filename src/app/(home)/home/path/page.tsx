import PathTerminal from "@/components/path-terminal";
import { clerkClient } from "@clerk/nextjs/server";

export const metadata = {
  title: "The Path",
};

export default function Page() {
  async function getUserEmails() {
    try {
      // Assuming getUserList() is a function that returns the array of user objects
      const { data } = await clerkClient.users.getUserList();

      const emails = data.flatMap((user) =>
        user.emailAddresses.map((emailObj) => emailObj.emailAddress),
      );

      return emails;
    } catch (error) {
      console.error("Error fetching user emails:", error);
      return [];
    }
  }

  void getUserEmails().then((emails) => {
    console.log("User emails:", emails);
  });

  return (
    <div className="container flex flex-col items-center justify-center px-4 py-6">
      <div className="h-screen w-full md:w-2/3 lg:w-1/2">
        <header className="mx-1 mb-4 md:mb-6 lg:mb-8">
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            The Path
          </h1>
          {/* <p className="pl-2 text-gray-400">Time to work</p> */}
        </header>
        <PathTerminal />
      </div>
    </div>
  );
}
