import { createClient } from "@/lib/supabase/server";

export const SETTING_KEYS = [
  "stripe_payments_enabled",
  "site_maintenance_mode",
  "new_design_submissions_enabled",
  "creator_payouts_enabled",
  "orders_enabled",
] as const;

export type SettingKey = (typeof SETTING_KEYS)[number];

export const DEFAULT_SETTINGS: Record<SettingKey, boolean> = {
  stripe_payments_enabled: true,
  site_maintenance_mode: false,
  new_design_submissions_enabled: true,
  creator_payouts_enabled: false,
  orders_enabled: true,
};

function normalizeBoolean(value: unknown, fallback: boolean) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return fallback;
}

export async function getAllSiteSettings(): Promise<Record<SettingKey, boolean>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("key,value").in("key", SETTING_KEYS);

  if (error) {
    return { ...DEFAULT_SETTINGS };
  }

  const settings = { ...DEFAULT_SETTINGS };
  for (const row of data ?? []) {
    const key = row.key as SettingKey;
    if (!SETTING_KEYS.includes(key)) continue;
    settings[key] = normalizeBoolean(row.value, DEFAULT_SETTINGS[key]);
  }

  return settings;
}

export async function getSiteSetting(key: SettingKey): Promise<boolean> {
  const settings = await getAllSiteSettings();
  return settings[key];
}

export async function updateSiteSetting(key: SettingKey, value: boolean, updatedBy: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").upsert(
    {
      key,
      value,
      updated_by: updatedBy,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );

  if (error) {
    throw new Error(error.message);
  }
}
