"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "대시보드" },
  { href: "/explore-products", label: "상품 탐색" },
  { href: "/my-products", label: "내 상품" },
  { href: "/settings", label: "설정" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-gray-700 bg-gray-800 px-4 py-4">
      <nav>
        <ul className="gap-4 flex flex-col space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`p-3 block rounded px-2  text-sm ${
                    isActive
                      ? "bg-gray-700 text-white"
                      : "text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
