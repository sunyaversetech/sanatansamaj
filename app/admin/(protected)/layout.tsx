import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { Separator } from "@/components/ui/separator";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The middleware already redirects unauthenticated requests before they
  // get here, but that's a cookie check on the edge — checking the session
  // again here is cheap and means this layout is never wrong on its own.
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <SidebarProvider>
      <AppSidebar email={session.user?.email ?? ""} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm font-medium text-muted-foreground">Admin</span>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
