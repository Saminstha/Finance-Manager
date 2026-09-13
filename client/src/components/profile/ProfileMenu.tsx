import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, LogOut, UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/auth/authSlice";
import { toast } from "@/components/ui/toast";

import EditProfileDialog from "./EditProfileDialog";
import ChangePasswordDialog from "./ChangePasswordDialog";

export default function ProfileMenu() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left outline-none hover:bg-sidebar-accent aria-expanded:bg-sidebar-accent">
          <Avatar className="size-8">
            <AvatarImage src={user?.profilePhoto} alt={user?.name} />

            <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground">
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {user?.name ?? "User"}
            </p>

            <p className="truncate text-xs text-sidebar-muted-foreground">
              {user?.email ?? ""}
            </p>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="top" align="start" sideOffset={10}>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setEditProfileOpen(true)}>
            <UserRound />
            Edit Profile
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setChangePasswordOpen(true)}>
            <KeyRound />
            Change Password
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem variant="destructive" onClick={handleLogout}>
            <LogOut />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditProfileDialog
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
      />

      <ChangePasswordDialog
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />
    </>
  );
}
