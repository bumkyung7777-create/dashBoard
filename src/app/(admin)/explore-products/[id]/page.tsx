"use client";
import { getProductById } from "@/services/external/dummyjson";
import { useEffect, useState } from "react";
import { createClient } from "@/services/supabase/client";
import { useRouter } from "next/navigation";
type Product = {
  id: number;
  images: string[];
  price: number;
  description: string;
  title: string;
  thumbnail: string[];
};
export default function ExploreProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  useEffect(() => {
    async function fetchProduct() {
      const res = await getProductById(params.id);
      setProduct(res.data);
    }
    fetchProduct();
  }, [params.id]);

  const insertDate = async () => {
    if (!product) return;

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log("지금 로그인된 사용자:", user);

    const { error } = await supabase.from("product").insert({
      title: product.title,
      price: product.price,
      description: product.description,
      images: product.images,
      thumbnail: product.images?.[0],
      // user_id는 안 넣어도 됨 — 테이블에 default auth.uid()로 설정해뒀으면
      // 로그인한 사용자 id가 자동으로 채워짐
    });

    if (error) {
      console.error("상품 저장 실패:", error);
      return;
    }
    router.refresh();
    console.log("상품 저장 완료");
  };
  return (
    <div>
      {product ? (
        <div>
          <div>
            {product.images?.map((img, index) => (
              <img key={index} src={img} alt={product.title} />
            ))}
          </div>
          <h1>{product.title}</h1>
          <p>Price: ${product.price.toFixed(2)}</p>
          <p>Description: {product.description}</p>
          <button onClick={insertDate}>내 상품추가</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
