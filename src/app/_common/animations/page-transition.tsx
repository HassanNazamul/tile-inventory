import React from "react";
import { motion } from "framer-motion";

const PageTransitionLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex items-center justify-center">
        <motion.div
          className="w-16 h-16 border-4 border-t-4 border-white rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
        />
        <span className="text-white ml-4">Loading...</span>
      </div>
    </div>
  );
};

export default PageTransitionLoader;
