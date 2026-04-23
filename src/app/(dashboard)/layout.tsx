import DashboardLayout from "@/components/layout/DashboardLayout";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ভবিষ্যতে এখানে সেশন চেক করে রোল পাস করব
  const role = "instructor"; // Temporary dummy role

  return (
    <DashboardLayout role={role}>
      {children}
    </DashboardLayout>
  );
}
