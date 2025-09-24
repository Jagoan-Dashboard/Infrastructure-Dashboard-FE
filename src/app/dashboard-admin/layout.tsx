// app/dashboard-admin/layout.tsx

import DashboardAdminLayout from "@/components/DashboardLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardAdminLayout>{children}</DashboardAdminLayout>;
}