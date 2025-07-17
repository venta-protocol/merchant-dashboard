"use client";

import { signOut as nextAuthSignOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { UpdateForm } from "@/forms/shop/update-shop-form";

export function UserMenu() {
  const { logout } = usePrivy();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    await nextAuthSignOut({ callbackUrl: "/login" });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <UserCircleIcon className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer hover:bg-gray-100"
            onClick={() => setOpen(true)}
          >
            Update Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer hover:bg-gray-100"
            onClick={handleLogout}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          {session?.user && (
            <UpdateForm
              id={session.user.id}
              shopName={session.user.name}
              receivingWallet={session.user.receivingWallet}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
