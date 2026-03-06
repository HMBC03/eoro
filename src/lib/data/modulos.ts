import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface ModuleConfig {
  module_key: string;
  label: string;
  visible: boolean;
  orden: number;
}

export async function getModuleConfig(): Promise<ModuleConfig[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .schema("eoro")
    .from("module_config")
    .select("module_key, label, visible, orden")
    .order("orden");
  return (data ?? []) as ModuleConfig[];
}

export async function isModuleVisible(moduleKey: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .schema("eoro")
    .from("module_config")
    .select("visible")
    .eq("module_key", moduleKey)
    .single();
  return data?.visible ?? true;
}
