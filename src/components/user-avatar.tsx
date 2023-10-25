import type { AvatarProps } from "@radix-ui/react-avatar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/icons";

interface UserAvatarProps extends AvatarProps {
  name: string;
}

export function UserAvatar({ name, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      <AvatarFallback>
        <span className="sr-only">{name}</span>
        <Icons.user className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  );
}
