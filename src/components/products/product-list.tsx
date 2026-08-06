import Link from "next/link";
export function ProductList({ products }: { products: any[] }) {
  console.log("products", products);
  return (
    <ul className="grid grid-cols-3 gap-5">
      {products.map((product) => (
        <li>
          <Link href={`/explore-products/${product.id}`}>
            <img src={product.thumbnail} alt={product.title} />
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p>{product.price}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
