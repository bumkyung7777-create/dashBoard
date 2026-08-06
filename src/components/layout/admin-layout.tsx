"use client";
import { usePathname } from "next/navigation";
export function AdminLayoutContent() {
  const pathname = usePathname();
  const titles: Record<string, string> = {
    "/dashboard": "대시보드",
    "/explore-products": "상품 탐색",
    "/my-products": "내 상품",
    "/settings": "설정",
  };
  const currentTitle =
    Object.entries(titles).find(([path]) => pathname.startsWith(path))?.[1] ??
    "Default Title";

  return (
    <div>
      <h2 className="text-xl">{currentTitle}</h2>
    </div>
  );
}
