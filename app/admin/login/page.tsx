import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";

// Intentionally not linked from anywhere on the public site (no nav item,
// no footer link) — reachable only by navigating to this URL directly.
export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
