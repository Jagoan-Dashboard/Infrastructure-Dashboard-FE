// components/DashboardAdminLayout.tsx
"use client";

import { ReactNode } from "react";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import AppSidebar from "@/layout/dashboard/AppSidebar";
import Backdrop from "@/layout/dashboard/Backdrop";
import AppHeader from "@/layout/dashboard/AppHeader";

interface LayoutContentProps {
  children: ReactNode;
}

const LayoutContent: React.FC<LayoutContentProps> = ({ children }) => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex bg-[#F8F3F5] xl:gap-4">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

interface DashboardAdminLayoutProps {
  children: ReactNode;
}

const DashboardAdminLayout: React.FC<DashboardAdminLayoutProps> = ({
  children,
}) => {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
};

export default DashboardAdminLayout;