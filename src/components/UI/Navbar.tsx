import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-32 py-6 w-full bg-gradient-to-b from-[#d0fbe7] to-[#ffffff]">
      {/* Logo */}
      <div className="w-[1200px] mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Image
            src="/images/logo.svg"
            alt="Voluntrix Logo"
            width={32}
            height={32}
          />
          <span className="text-xl font-bold font-primary text-shark-950 tracking-widest">
            Voluntrix
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-12 text-shark-950 text-md font-primary tracking-wider font-medium">
          <Link
            href="#"
            className="relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-verdant-600"
          >
            Home
          </Link>
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
        <div className="flex space-x-4">
          <button className="text-md text-shark-950 font-primary px-5 py-2 border-0 tracking-[1px] font-medium">
            Login
          </button>
          <button className="bg-verdant-600 text-white text-sm font-primary px-6 py-0 rounded-lg shadow-md tracking-[1px]">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}
