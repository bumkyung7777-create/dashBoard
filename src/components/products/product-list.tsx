import Link from "next/link";
export function ProductList({ products }: { products: any[] }) {
  return (
    <ul className="grid grid-cols-3 gap-5">
      {products.map((product) => (
        <li key={product.id} className="border p-4 rounded-lg">
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
