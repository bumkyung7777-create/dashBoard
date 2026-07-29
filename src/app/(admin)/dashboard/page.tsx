import { createClient } from "@/services/supabase/server";
import { signOut } from "@/features/auth/actions";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data, error } = await supabase.from("Auth").select("*");

  console.log({ data, error });

  return <div>메인 LAYOUT</div>;
}
