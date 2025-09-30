"use client";
import SidebarNav from "./SidebarNav";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full p-4 lg:p-6 bg-gray-100">
      <div className="flex gap-6">
        {/* Sidebar column */}
        <aside className="hidden lg:block sticky top-0 h-[100dvh] w-64 shrink-0">
          <SidebarNav />
        </aside>

        {/* Main column */}
        <main className="flex-1 min-h-[calc(100dvh-64px)] bg-white px-6 rounded-2xl py-4">{children}</main>
      </div>
    </div>
  );
}