"use client";
import { getProductById } from "@/services/external/dummyjson";
import { useEffect, useState } from "react";
type Product = {
  images: string[];
  price: number;
  description: string;
  tags: string[];
  title: string;
};
export default function ExploreProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, setProduct] = useState<Product | null>(null);
  useEffect(() => {
    async function fetchProduct() {
      const res = await getProductById(params.id);
      setProduct(res.data);
    }
    fetchProduct();
  }, [params.id]);

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
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
