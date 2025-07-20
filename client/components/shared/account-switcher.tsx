"use client";

import { useState } from "react";
import { BadgeCheck, Bell, CreditCard, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

type User = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly avatar: string;
  readonly role: string;
};

const defaultUsers: User[] = [
  {
    id: "1",
    name: "Monty User",
    email: "user@monty.com",
    avatar: "/avatars/user.jpg",
    role: "admin",
  },
  {
    id: "2",
    name: "Demo User",
    email: "demo@monty.com",
    avatar: "/avatars/demo.jpg",
    role: "user",
  },
];

export function AccountSwitcher({
  users = defaultUsers,
}: {
  readonly users?: readonly User[];
}) {
  const [activeUser, setActiveUser] = useState(users[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-9 rounded-lg cursor-pointer hover:opacity-80 transition-opacity">
          <AvatarImage
            src={activeUser.avatar || undefined}
            alt={activeUser.name}
          />
          <AvatarFallback className="rounded-lg">
            {getInitials(activeUser.name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-56 space-y-1 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        {users.map((user) => (
          <DropdownMenuItem
            key={user.email}
            className={cn(
              "p-0",
              user.id === activeUser.id &&
                "bg-accent/50 border-l-primary border-l-2"
            )}
            onClick={() => setActiveUser(user)}
          >
            <div className="flex w-full items-center justify-between gap-2 px-1 py-1.5">
              <Avatar className="size-9 rounded-lg">
                <AvatarImage src={user.avatar || undefined} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs capitalize">{user.role}</span>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck className="size-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="size-4" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell className="size-4" />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
