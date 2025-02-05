import Image from "next/image";
import Button from "./Button";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-md">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Image
          src="/images/logo.svg"
          alt="Voluntrix Logo"
          width={40}
          height={40}
        />
        <span className="text-xl font-bold text-verdant-600">Voluntrix</span>
      </div>

      {/* Navigation Links */}
      <div className="flex space-x-6 text-shark-800 font-primary">
        <Link
          href="#"
          className="relative text-verdant-600 font-semibold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-verdant-600"
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
      {/* <div className="flex space-x-4">
        <Button label="Login" variant="secondary" />
        <Button label="Sign Up" variant="primary" />
      </div> */}
    </nav>
  );
}
