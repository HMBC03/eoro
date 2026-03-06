import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not logged in — let middleware handle redirect for non-login pages
  // But if we're on /admin/login, render children directly (no shell)
  if (!user) {
    return <>{children}</>;
  }

  // Check admin role
  const { data: adminData } = await supabase
    .schema("eoro")
    .from("admin_users")
    .select("id, nombre, rol, activo")
    .eq("user_id", user.id)
    .single();

  if (!adminData || !adminData.activo) {
    redirect("/");
  }

  return (
    <AdminShell
      adminName={adminData.nombre || user.email || "Admin"}
      adminRole={adminData.rol}
    >
      {children}
    </AdminShell>
  );
}
