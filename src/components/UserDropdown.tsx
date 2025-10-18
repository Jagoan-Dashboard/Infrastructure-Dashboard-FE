
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LoginService } from "@/app/login/service/login-service";
import { toast } from "sonner";

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

  return (
    <div className="user-dropdown">
      <p>Welcome, {user?.username}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}