"use client";

import Image from "next/image";
import Link from "next/link";import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    ScrollTrigger.create({
      trigger: ".hero-section",
      start: "bottom top",
      onEnter: () => setIsScrolled(true),
      onLeaveBack: () => setIsScrolled(false),
    });
  }, []);
  return (
    <nav className={`fixed z-50 top-0 flex items-center justify-between px-32 py-6 w-full }`}>
      {/* Logo */}
      <div className="w-[1200px] mx-auto flex items-center justify-between">
        <div className="">
          <Image
            src="/images/logo.svg"
            alt="Voluntrix Logo"
            width={190}
            height={50}
          />
          {/* <span className="text-[1.35rem] font-bold font-primary text-shark-950 tracking-widest">
            Voluntrix
          </span> */}
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-16 text-shark-950 text-[1.05rem] font-primary tracking-wider font-medium">
          {/* <Link
            href="#"
            className="relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-verdant-600"
          >
            Home
          </Link> */}
          <Link href="#" className="hover:text-verdant-600">
            Features
          </Link>
          <Link href="#" className="hover:text-verdant-600">
            Events
          </Link>
          <Link href="#" className="hover:text-verdant-600">
            Event Feed
          </Link>
          <Link href="#" className="hover:text-verdant-600">
            Volunteers
          </Link>
        </div>

        {/* Login & Sign Up Buttons */}
        <div className="flex space-x-4 text-[1.05rem]">
          <button className="text-md text-shark-950 font-primary px-5 py-2 border-0 tracking-[1px] font-medium">
            Login
          </button>
          <button className="bg-shark-950 text-white text-sm font-primary px-5 py-2 rounded-[20px] shadow-md tracking-[1px]">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}
