import Header from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { AdminLayoutContent } from "@/components/layout/admin-layout";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <Header />

      <div className="flex min-h-screen">
        <Sidebar />
        <main className="p-8 flex-1">
          <AdminLayoutContent />
          {children}
        </main>
      </div>
    </div>
  );
}
