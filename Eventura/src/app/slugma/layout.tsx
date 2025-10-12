// src/app/home/layout.tsx
import type { ReactNode } from "react";
// import Header from "@/components/header/Header";
// can be used if you have a common header for many pages

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {/* <Header /> */}
      {/* Uncomment the <Header /> component to use it */}
      {children}
    </div>
  );
}
