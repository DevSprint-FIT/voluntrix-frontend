"use client";

export default function TestimonialSection() {
  return (
    <section className="w-full bg-[#ffffff] py-16 px-8 md:px-16 lg:px-32 flex flex-col items-center text-center font-primary mt-12 mb-12">
      <div className="max-w-3xl">
        <p className="text-[2rem] md:text-[2.5rem] font-semibold text-shark-950 leading-tight">
          <span className="text-verdant-600">“</span>
          Strengthen volunteer engagement,{" "}
          <span className="text-verdant-600 font-bold">streamline event management</span>,{" "}
          and{" "}
          <span className="text-verdant-600 font-bold">attract more sponsors</span>{" "}
          effortlessly with Voluntrix
          <span className="text-verdant-600">”</span>
        </p>
        <p className="mt-4 text-lg text-shark-950 font-semibold">
          Harindu Hadithya <span className="text-verdant-600">/</span> DevSprint
        </p>
      </div>
    </section>
  );
}
