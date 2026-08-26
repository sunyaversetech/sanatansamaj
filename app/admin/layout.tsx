import type { Metadata } from "next";
import { AuthSessionProvider } from "@/components/providers/auth-session-provider";
import { QueryProvider } from "@/components/providers/query-provider";

export const metadata: Metadata = {
  title: "Admin · Sanatan Samaj Australia",
  robots: { index: false, follow: false },
};

// Shared by both /admin/login and the authenticated (protected) area — just
// context providers here, no sidebar/auth-guard (that lives one level down
// in (protected)/layout.tsx) so the login page stays a bare, unstyled shell.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthSessionProvider>
      <QueryProvider>{children}</QueryProvider>
    </AuthSessionProvider>
  );
}
