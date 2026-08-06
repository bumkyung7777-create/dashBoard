export function ProductTable({
  uniqueCategoryArr,
  setCategory,
}: {
  uniqueCategoryArr: string[];
  setCategory: (category: string) => void;
}) {
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

  return (
    <ul className="card-list flex flex-wrap gap-4 mt-5">
      {uniqueCategoryArr.map((item: string, index: number) => (
        <li key={index}>
          <button onClick={() => setCategory(item)} className="w-full">
            {getCategoryLabel(item)}
          </button>
        </li>
      ))}
    </ul>
  );
}
