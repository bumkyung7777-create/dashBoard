"use client";
import { usePathname } from "next/navigation";
import { signOut } from "@/features/auth/actions";
export default function Header() {
  const pathname = usePathname();
  const titles: Record<string, string> = {
    "/dashboard": "대시보드",
    "/explore-products": "상품 탐색",
    "/my-products": "내 상품",
    "/settings": "설정",
  };
  return (
    <div className="flex flex-col  p-4 bg-gray-800 text-white">
      <div>
        <button
          onClick={() => {
            signOut;
          }}
        >
          로그아웃
        </button>
      </div>
      <div>{titles[pathname] || "Default Title"}</div>
    </div>
  );
}
