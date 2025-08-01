'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@heroui/button';
import authService from '@/services/authService';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: 'top+=10px top',
      onEnter: () => setIsScrolled(true),
      onLeaveBack: () => setIsScrolled(false),
    });

    return () => trigger.kill();
  }, []);

  const login = () => {
    router.push('/auth/login');
  };

  const signup = () => {
    router.push('/auth/signup');
  };

  const eventPath = authService.isAuthenticated()
    ? '/events'
    : '/public/events';

  return (
    <nav
      className={`fixed z-50 top-0 flex items-center justify-between px-32 w-full transition-all duration-300 ease-in-out ${
        isScrolled ? 'shadow-md bg-white py-2' : 'bg-transparent py-6'
      }`}
    >
      <div
        className={`w-[1250px] mx-auto flex items-center justify-between transition-all duration-300 ease-in-out`}
      >
        <div
          className={`transition-all duration-300 ease-in-out ${
            isScrolled ? 'scale-90' : 'scale-100'
          }`}
        >
          <Link href="/">
            <Image
              src="/images/logo.svg"
              alt="Voluntrix Logo"
              width={190}
              height={50}
            />
          </Link>
        </div>

        <div
          className={`flex space-x-16 text-shark-950 text-[1rem] font-primary tracking-wider font-medium transition-all duration-300 ease-in-out ${
            isScrolled ? 'text-[0.95rem]' : 'text-[1.05rem]'
          }`}
        >
          <Link
            href="#"
            className="transition-all duration-300 ease-in-out hover:text-verdant-600"
          >
            Features
          </Link>
          <Link
            href={eventPath}
            className="transition-all duration-300 ease-in-out hover:text-verdant-600"
          >
            Events
          </Link>
          <Link
            href="/PublicFeed"
            className="transition-all duration-300 ease-in-out hover:text-verdant-600"
          >
            Social Feed
          </Link>
          <Link
            href="#"
            className="transition-all duration-300 ease-in-out hover:text-verdant-600"
          >
            Volunteers
          </Link>
        </div>

        {/* Login & Sign Up Buttons */}
        <div className="flex space-x-4 text-[1rem] transition-all duration-300 ease-in-out">
          <Button
            onPress={login}
            variant="light"
            className="text-md text-shark-950 font-primary border-0 tracking-[1px] font-medium px-4 py-2 rounded-[20px]"
          >
            Login
          </Button>
          <Button
            onPress={signup}
            variant="shadow"
            className="bg-shark-950 text-white text-sm font-primary px-4 py-2 rounded-[20px] tracking-[1px]"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </nav>
  );
}
