"use client";
import { signOut } from "@/features/auth/actions";
import Link from "next/link";
export default function Header() {
  return (
    <div className="flex flex-col  ">
      <div className="h-[64px] py-2 shadow-lg px-4 md:sticky top-0 bg-gray-800 z-40">
        <div className="flex h-full justify-between items-center">
          <Link href="/">
            <img className="w-10" src="/react.png" alt="logo" />
          </Link>

          <button
            onClick={() => {
              signOut();
            }}
            className="group flex items-center gap-2 text-white"
          >
            <svg
              className="h-8 w-8 transition-transform duration-300 group-hover:-rotate-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m17 16 4-4m0 0-4-4m4 4H7m6 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1"
              />
            </svg>
            <span>로그아웃</span>
          </button>
        </div>
      </div>
    </div>
  );
}
