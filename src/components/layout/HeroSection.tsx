import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="max-w-screen-xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="space-y-5">
        <h1 className="text-5xl font-bold text-verdant-600 font-primary">
          Goodbye to chaos.
        </h1>
        <h2 className="text-3xl font-semibold text-shark-950 font-primary">
          Say hello to streamlined <br />
          volunteer management
        </h2>
        <p className="text-lg text-shark-950 font-secondary">
          Empower your team with one platform to manage events, <br />
          engage volunteers, and connect sponsors effortlessly.
        </p>
        <button className="bg-shark-950 text-white text-lg font-primary tracking-widest flex items-center gap-2 px-5 py-2 rounded-lg shadow-md">
          Explore Now
          <Image
            src="/icons/arrow.svg"
            alt="Arrow Icon"
            width={27}
            height={20}
          />
        </button>
      </div>

      <div className="grid grid-cols-2">
        <Image
          src="/images/hero-section-image-1.png"
          alt="Volunteers cleaning beach"
          width={215}
          height={143}
          className="rounded-3xl shadow-md ml-5 mt-20"
        />
        <Image
          src="/images/hero-section-image-2.png"
          alt="Community gardening"
          width={262}
          height={186}
          className="rounded-3xl shadow-md mt-12 -ml-14"
        />
        <Image
          src="/images/hero-section-image-3.png"
          alt="Hands holding plant"
          width={251}
          height={309}
          className="rounded-3xl shadow-md -mt-1"
        />
        <Image
          src="/images/hero-section-image-4.png"
          alt="Food distribution"
          width={310}
          height={223}
          className="rounded-3xl shadow-md mt-2 -ml-10"
        />
      </div>
    </section>
  );
}
