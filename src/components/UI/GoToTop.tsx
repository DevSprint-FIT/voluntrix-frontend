"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function GoToTop() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.button
      className="fixed bottom-6 right-6 bg-verdant-200 p-3 rounded-2xl shadow-md flex items-center justify-center hover:bg-verdant-300 transition-all duration-300"
      onClick={scrollToTop}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: showButton ? 1 : 0, y: showButton ? 0 : 50 }}
      transition={{ duration: 0.3 }}
    >
      <Image src="/icons/arrow-up.svg" width={20} height={20} alt="Go to top" />
    </motion.button>
  );
}
