import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold font-primary text-verdant-800">Welcome to Voluntrix</h1>
      <h1 className="text-lg font-secondary mt-2">
        Connecting volunteers, organizations, and sponsors to create meaningful impact.
      </h1>
    </main>
  );
}
