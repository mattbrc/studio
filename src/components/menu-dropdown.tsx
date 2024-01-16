import * as React from "react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "./user-avatar";

import type { MainNavItem } from "../types";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

interface MainNavProps {
  items?: MainNavItem[];
  children?: React.ReactNode;
}

export function MenuDropdown({ items, children }: MainNavProps) {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Icons.menu size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="start">
          {/* <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-bold">AG Studio</p>
            </div>
          </div> */}
          <DropdownMenuItem>
            <p className="text-md font-bold">AG Studio</p>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard">Home</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-zinc-500" asChild>
            <Link href="">Training</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-zinc-500" asChild>
            <Link href="">Nutrition</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-zinc-500" asChild>
            <Link href="">Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}