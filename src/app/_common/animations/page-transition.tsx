"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageTransitionLoader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500); // Adjust duration if needed
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <div className="relative">
      {/* Only show loader overlay on page content */}
      {loading && (
        <div className="fixed w-full h-full bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          {/* No spinner here */}
        </div>
      )}
      {children}
    </div>
  );
}
