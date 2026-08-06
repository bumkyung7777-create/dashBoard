import { createClient } from "@/services/supabase/server";
import { ProductList } from "@/components/products/product-list";

export default async function MyProductsPage() {
  const supabase = createClient();
  const { data, error } = await supabase.from("product").select("*");

  console.log("심범경", data, error);
  return <ProductList products={data ?? []} />;
}
