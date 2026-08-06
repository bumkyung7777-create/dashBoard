"use client";

import { getProducts } from "@/services/external/dummyjson";

import { useEffect, useMemo, useState } from "react";

type Product = {
  category: string;
  price: number;
};

export function KpiCard() {
  const [products, setProducts] = useState<Product[]>([]);
  const totalCategories = new Set(products.map((product) => product.category))
    .size;
  const totalPrice = products
    .map((product) => product.price)
    .reduce((sum, price) => sum + price, 0);

  const averagePrice =
    products.length === 0 ? 0 : Math.round(totalPrice / products.length);

  useEffect(() => {
    async function fetchProducts() {
      const res = await getProducts();
      setProducts(res.data.products);
    }
    fetchProducts();
  }, []);

  return (
    <div className="p-4">
      <h3 className="mb-2 text-lg text-gray-500 pb-3.5 mb-3.5 dash-title">
        KPI CARD
      </h3>
      <ul className="kpi-card flex justify-start gap-[10%]">
        <li className="p-10 ">
          <div className="flex flex-col items-center gap-[0.94rem]">
            <img
              src="https://cdn-icons-png.flaticon.com/512/5632/5632430.png"
              alt=""
            />
            <span>총: {products.length}개</span>
          </div>
        </li>
        <li className="p-10 ">
          <div className="flex flex-col items-center gap-[0.94rem]">
            <img
              src="https://cdn-icons-png.flaticon.com/512/9535/9535263.png"
              alt=""
            />
            <span>카테고리: {totalCategories}개</span>
          </div>
        </li>
        <li className="p-10 ">
          <div className="flex flex-col items-center gap-[0.94rem]">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSovYhn0WHOpMh00ducv3mdhUwtjJn_PBclFw&s"
              alt=""
            />
            <span>평균: {averagePrice}00원</span>
          </div>
        </li>
      </ul>
    </div>
  );
}
