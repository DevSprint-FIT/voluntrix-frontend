import Link from "next/link";

export default function Breadcrumb() {
  return (
    <div className="h-8 w-[1200px] flex items-center justify-start">
      <p className="font-secondary font-medium text-shark-950 text-lg">
        <Link href="#">Home</Link>
        <span className="text-shark-300"> / </span> 
        <Link href="#">Events</Link>
      </p>
    </div>
  );
}
