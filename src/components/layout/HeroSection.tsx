"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@heroui/button";

export default function HeroSection() {
  return (
    <section className="w-[1200px] py-20 px-12 relative max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 items-center hero-section mt-16 overflow-hidden">
      <motion.div
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        animate={{
          x: [0, 100, -100, 50, -50, 0],
          y: [0, -50, 50, -100, 100, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="absolute w-72 h-72 bg-verdant-600 opacity-30 rounded-full top-1/4 left-1/3 mix-blend-difference blur-[100px]"></div>
        <div className="absolute w-48 h-48 bg-verdant-400 opacity-30 rounded-full bottom-1/4 right-1/3 mix-blend-difference blur-[80px]"></div>
      </motion.div>

      <div className="relative z-10">
        <div className="space-y-4">
          <h1 className="text-[3.2rem] font-medium text-verdant-600 font-secondary">
            Goodbye to chaos.
          </h1>
          <h2 className="text-[1.75rem] font-semibold text-shark-950 font-primary tracking-[0.7px] leading-[1.2]">
            <span className="tracking-[1.5px]">Say hello to streamlined</span> <br />
            volunteer management
          </h2>
          <p className="text-lg text-shark-950 font-secondary">
            Empower your team with one platform to manage events, <br />
            engage volunteers, and connect sponsors effortlessly.
          </p>
        </div>
        <Button variant="shadow" className="mt-5 bg-shark-950 text-white text-md font-primary tracking-[0.8px] flex items-center gap-2 px-5 py-2 rounded-[20px]">
          Explore Now
          <Image src="/icons/arrow.svg" alt="Arrow Icon" width={25} height={18} />
        </Button>
      </div>

      <div className="relative z-10">
        <Image src="/images/hero.webp" alt="Volunteers cleaning beach" width={600} height={600} />
      </div>
    </section>
  );
}
