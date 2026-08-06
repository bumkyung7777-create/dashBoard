"use client";

import { getProducts, getProductsByCategory } from "@/services/external/dummyjson";
import { useEffect, useState } from "react";
import { ProductTable } from "./product-table";
import { ProductList } from "./product-list";
type Product = {
  category: string;
};

export function ExternalProductGrid() {
  const [category, setCategory] = useState("");
  const [product, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const categoryArr = product.map((item: any) => item.category);
  const uniqueCategoryArr = Array.from(new Set(categoryArr));

  // 카테고리 버튼 목록용 — 전체 상품을 딱 한 번만 가져옴
  useEffect(() => {
    async function fetchProducts() {
      const res = await getProducts();
      setProducts(res.data.products);
    }
    fetchProducts();
  }, []);

  // 화면에 뿌릴 목록용 — category가 바뀔 때마다 그 카테고리로 다시 가져옴
  useEffect(() => {
    async function fetchFilteredProducts() {
      if (!category) {
        setFilteredProducts(product);
        return;
      }
      const res = await getProductsByCategory(category);
      setFilteredProducts(res.data.products);
    }
    fetchFilteredProducts();
  }, [category, product]);

  return (
    <div>
      <ProductTable
        setCategory={setCategory}
        uniqueCategoryArr={uniqueCategoryArr}
      />
      <ProductList products={filteredProducts} />
    </div>
  );
}
