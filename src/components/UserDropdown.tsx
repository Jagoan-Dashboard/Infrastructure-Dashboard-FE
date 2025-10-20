
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LoginService } from "@/app/login/service/login-service";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon, Settings, LogOut } from "lucide-react";

export default function UserDropdown() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      
      await LoginService.logout();
      
      
      logout();
      
      
      toast.success('Logout Berhasil', {
        description: 'Anda telah keluar dari sistem'
      });
      
      
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      
      
      logout();
      router.push('/login');
    }
  };

    const initials = user?.username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-700";
      case "OPERATOR":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="user-dropdown">
      <p>Welcome, {user?.username}</p>
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent/50 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatar-placeholder.png" alt={user?.username} />
            <AvatarFallback className="bg-pink-400 text-white font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-foreground">
              {user?.username}
            </p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user?.username}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
            <span
              className={`text-xs px-2 py-0.5 rounded-full w-fit mt-1 ${getRoleBadgeColor(user?.role || "")}`}
            >
              {user?.role}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  );
}