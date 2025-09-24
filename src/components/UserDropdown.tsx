"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RxExit } from "react-icons/rx";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "./ui/badge";
import Image from "next/image";
import { assets } from "@/assets/assets";

// Interface for dropdown menu items
interface DropdownMenuItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  action?: () => void;
  type?: 'link' | 'button';
  className?: string;
}

const userDropdownMenu: DropdownMenuItem[] = [
  { 
    label: "Profile", 
    href: "/dashboard-admin/profile",
    type: 'link',
    icon: (
      <svg
        className="w-4 h-4 text-gray-500"
        fill="none"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clipRule="evenodd"
          d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 14.1526 4.3002 16.1184 5.61936 17.616C6.17279 15.3096 8.24852 13.5955 10.7246 13.5955H13.2746C15.7509 13.5955 17.8268 15.31 18.38 17.6167C19.6996 16.119 20.5 14.153 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM17.0246 18.8566V18.8455C17.0246 16.7744 15.3457 15.0955 13.2746 15.0955H10.7246C8.65354 15.0955 6.97461 16.7744 6.97461 18.8455V18.856C8.38223 19.8895 10.1198 20.5 12 20.5C13.8798 20.5 15.6171 19.8898 17.0246 18.8566ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9991 7.25C10.8847 7.25 9.98126 8.15342 9.98126 9.26784C9.98126 10.3823 10.8847 11.2857 11.9991 11.2857C13.1135 11.2857 14.0169 10.3823 14.0169 9.26784C14.0169 8.15342 13.1135 7.25 11.9991 7.25ZM8.48126 9.26784C8.48126 7.32499 10.0563 5.75 11.9991 5.75C13.9419 5.75 15.5169 7.32499 15.5169 9.26784C15.5169 11.2107 13.9419 12.7857 11.9991 12.7857C10.0563 12.7857 8.48126 11.2107 8.48126 9.26784Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    )
  },
  { 
    label: "Billing", 
    href: "/dashboard-admin/billing",
    type: 'link',
    icon: (
      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
    )
  },
  { 
    label: "Team", 
    href: "/dashboard-admin/team",
    type: 'link',
    icon: (
      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
      </svg>
    )
  },
];

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleLogout = async () => {
    try {
      setIsLogoutLoading(true);
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLogoutLoading(false);
    }
  };

  const handleMenuItemClick = (item: DropdownMenuItem) => {
    if (item.action) {
      item.action();
    }
    closeDropdown();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center text-gray-700 hover:bg-gray-50 rounded-lg p-2 transition-colors"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <Image 
            alt="User" 
            src={user?.foto || assets.defaultAvatar} 
            width={44} 
            height={44}
            className="object-cover"
          />
        </span>
        <div className="text-left min-w-[120px]">
          <div className="flex gap-2 flex-col justify-start items-start">
            <Badge className="text-xs bg-pink-700">
              {user?.role?.display_name || "User"}
            </Badge>
            <span className="text-xs text-gray-500">SuperAdmin</span>
          </div>
        </div>
        <svg
          className={`ml-2 stroke-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          height="20"
          viewBox="0 0 18 20"
          width="18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200">
            <span className="block font-medium text-gray-700 text-sm">
              {user?.nama || "User"}
            </span>
            <span className="block text-xs text-gray-500 mt-0.5">
              {user?.email || "user@example.com"}
            </span>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {userDropdownMenu.map((item, index) => {
              const baseClassName = `flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${item.className || ''}`;
              
              if (item.type === 'link' && item.href) {
                return (
                  <Link
                    key={index}
                    href={item.href}
                    className={baseClassName}
                    onClick={closeDropdown}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              }
              
              return (
                <button
                  key={index}
                  className={baseClassName}
                  onClick={() => handleMenuItemClick(item)}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}

            {/* Separator */}
            <div className="my-2 h-px bg-gray-200" />

            {/* Logout Button */}
            <button
              className="flex cursor-pointer items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              onClick={handleLogout}
              disabled={isLogoutLoading}
            >
              {isLogoutLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  <span>Logging out...</span>
                </>
              ) : (
                <>
                  <RxExit className="w-4 h-4" />
                  <span>Logout</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}