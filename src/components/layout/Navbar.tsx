import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-32 py-6 shadow-md">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <Image
          src="/images/logo.svg"
          alt="Voluntrix Logo"
          width={40}
          height={40}
        />
        <span className="text-2xl font-bold font-primary text-shark-950 tracking-widest">
          Voluntrix
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex space-x-12 text-shark-950 text-lg font-primary tracking-wider font-medium">
        <Link
          href="#"
          className="relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-1 after:bg-verdant-600"
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
        <button className="text-lg text-shark-950 font-primary px-5 py-2 border-0 tracking-widest font-medium">
          Login
        </button>
        <button className="bg-verdant-600 text-white font-primary px-6 py-0 rounded-lg shadow-md tracking-widest">
          Sign Up
        </button>
      </div>
    </nav>
  );
}
