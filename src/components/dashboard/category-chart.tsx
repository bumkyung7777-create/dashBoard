"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getProducts } from "@/services/external/dummyjson";

import { useEffect, useMemo, useState } from "react";

type Product = {
  category: string;
};

type CategoryDatum = {
  category: string;
  count: number;
};

const categoryMap: Record<string, string> = {
  beauty: "뷰티",
  fragrances: "향수",
  furniture: "가구",
  groceries: "식료품",
  "home-decoration": "홈데코",
  "kitchen-accessories": "주방용품",
  laptops: "노트북",
  "mens-shirts": "남성 셔츠",
  "mens-shoes": "남성 신발",
  "mens-watches": "남성 시계",
  "mobile-accessories": "모바일 액세서리",
  motorcycle: "오토바이",
  "skin-care": "스킨케어",
  smartphones: "스마트폰",
  "sports-accessories": "스포츠 용품",
  sunglasses: "선글라스",
  tablets: "태블릿",
  tops: "상의",
  vehicle: "차량",
  "womens-bags": "여성 가방",
  "womens-dresses": "여성 원피스",
  "womens-jewellery": "여성 주얼리",
  "womens-shoes": "여성 신발",
  "womens-watches": "여성 시계",
};

const getCategoryLabel = (slug: string) => categoryMap[slug] ?? slug;

export function CategoryChart() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const res = await getProducts();
      setProducts(res.data.products);
    }
    fetchProducts();
  }, []);

  const data: CategoryDatum[] = useMemo(() => {
    const counts = new Map<string, number>();
    for (const product of products) {
      counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
    }
    return Array.from(counts, ([category, count]) => ({
      category: getCategoryLabel(category),
      count,
    })).sort((a, b) => b.count - a.count);
  }, [products]);

  // 카테고리 개수가 많을 때 막대가 너무 눌리지 않도록 높이를 데이터 개수에 맞춰 늘림
  const chartHeight = Math.max(220, data.length * 28);

  return (
    <div className="p-4">
      <h3 className="dash-title mb-2 text-lg text-gray-500 pb-3.5 mb-3.5">
        카테고리별 상품 수
      </h3>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
        >
          <CartesianGrid
            horizontal={false}
            stroke="#e1e0d9"
            strokeDasharray="3 3"
          />
          <XAxis
            type="number"
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#898781", fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="category"
            width={110}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#52514e", fontSize: 12 }}
          />
          <Tooltip cursor={{ fill: "rgba(42,120,214,0.08)" }} />
          <Bar
            dataKey="count"
            fill="#2a78d6"
            radius={[0, 4, 4, 0]}
            barSize={16}
          >
            <LabelList
              dataKey="count"
              position="right"
              fill="#0b0b0b"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
