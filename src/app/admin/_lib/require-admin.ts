"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: admin } = await supabase
    .schema("eoro")
    .from("admin_users")
    .select("rol, activo")
    .eq("user_id", user.id)
    .single();

  if (!admin?.activo) redirect("/");
  return { supabase, user, rol: admin.rol };
}
