/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useTheme } from "next-themes";
export default function AuthPageTransition() {

    const { theme, setTheme } = useTheme(); // Access the current theme

    return (
        <div className="relative">
            <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm flex items-center justify-center z-50">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-white" style={{
                    animationDuration: "8s",
                    borderColor: theme === "dark" ? "white" : "black", // Example: Change border color based on theme
                }}></div>
            </div>
        </div>
    );
}
