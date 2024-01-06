import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { UserProfile } from "@clerk/nextjs";

const UserProfileModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>Manage Account</button>
      </DialogTrigger>
      <DialogContent>
        <UserProfile />
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
