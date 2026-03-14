import NavSidebar from "@/components/dashboard/nav-sidebar";
import StatsBar from "@/components/dashboard/stats-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <NavSidebar />
      <div className="flex-1 flex flex-col">
        <StatsBar />
        <main className="flex-1 p-6 pb-20 md:pb-6">{children}</main>
      </div>
    </div>
  );
}
