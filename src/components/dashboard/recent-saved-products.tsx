"use client";
import { getTableData } from "@/services/external/likeStore";
import { useEffect, useState } from "react";

export function RecentSavedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getTableData("product");
      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <div className="p-4">
      <h3 className="mb-2 text-lg text-gray-500 pb-3.5 mb-3.5 dash-title">
        최근 저장된 상품
      </h3>
    </div>
  );
}
