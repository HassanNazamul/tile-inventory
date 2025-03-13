"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthPageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 500); // Adjust duration if needed
        return () => clearTimeout(timeout);
    }, [pathname]);

    return (
        <div className="relative">
            {loading && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-white"></div>
                </div>
            )}
            {children}
        </div>
    );
}
