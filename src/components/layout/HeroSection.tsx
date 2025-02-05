import Image from "next/image";
import Button from "./Button";

export default function HeroSection() {
  return (
    <section className="max-w-screen-xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-verdant-700">
          Goodbye to chaos.
        </h1>
        <h2 className="text-2xl font-semibold text-shark-900">
          Say hello to streamlined volunteer management
        </h2>
        <p className="text-shark-700">
          Empower your team with one platform to manage events, engage
          volunteers, and connect sponsors effortlessly.
        </p>
        {/* <Button label="Explore Now" variant="primary" showArrow={true} /> */}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Image
          src="/images/hero-section-image-1.png"
          alt="Volunteers cleaning beach"
          width={300}
          height={200}
          className="rounded-2xl shadow-md"
        />
        <Image
          src="/images/hero-section-image-2.png"
          alt="Community gardening"
          width={300}
          height={200}
          className="rounded-2xl shadow-md"
        />
        <Image
          src="/images/hero-section-image-3.png"
          alt="Hands holding plant"
          width={300}
          height={200}
          className="rounded-2xl shadow-md"
        />
        <Image
          src="/images/hero-section-image-4.png"
          alt="Food distribution"
          width={300}
          height={200}
          className="rounded-2xl shadow-md"
        />
      </div>
    </section>
  );
}
