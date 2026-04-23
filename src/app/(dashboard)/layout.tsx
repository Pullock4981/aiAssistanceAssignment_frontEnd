"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { usePathname } from "next/navigation";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const role = pathname?.startsWith("/student") ? "student" : "instructor";

  return (
    <DashboardLayout role={role}>
      {children}
    </DashboardLayout>
  );
}
