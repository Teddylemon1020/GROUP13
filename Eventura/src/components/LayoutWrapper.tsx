'use client';

import ThemeToggle from './ThemeToggle';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed top-4 right-4 z-[9999]">
        <ThemeToggle />
      </div>
      {children}
    </>
  );
}
