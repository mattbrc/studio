import * as React from "react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";

export function MenuDropdown() {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Icons.menu size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="start">
          <DropdownMenuItem>
            <Link href="/home" className="text-md font-bold">
              AG Studio
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/home">Home</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/home/tracks">Tracks</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/home/programs">Programs</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/home/wod">Daily Workouts</Link>
          </DropdownMenuItem>
          {/* <DropdownMenuItem asChild>
            <Link href="/home/nutrition">Nutrition (beta)</Link>
          </DropdownMenuItem> */}
          {/* <DropdownMenuItem className="text-zinc-500" asChild>
            <Link href="">History</Link>
          </DropdownMenuItem> */}
          <DropdownMenuItem asChild>
            <Link href="/billing">Billing + Plans</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/home/contact">Contact</Link>
          </DropdownMenuItem>
          {/* <DropdownMenuItem className="text-zinc-500" asChild>
            <Link href="">Pricing</Link>
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
