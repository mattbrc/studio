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
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-bold">AG Studio</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard">Home</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/training">Training</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="">Nutrition (wip)</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="">Settings (wip)</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
