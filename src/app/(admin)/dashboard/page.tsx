import { createClient } from "@/services/supabase/server";
import { signOut } from "@/features/auth/actions";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { RecentSavedProducts } from "@/components/dashboard/recent-saved-products";
export default async function DashboardPage() {
  const supabase = createClient();
  const { data, error } = await supabase.from("Auth").select("*");

  console.log({ data, error });

  return (
    <div>
      <CategoryChart />
      <KpiCard />
      <RecentSavedProducts />
    </div>
  );
}
