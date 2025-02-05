import Image from "next/image";

interface ButtonProps {
  text: string;
  bgColor?: string;
  fontColor?: string;
  fontFamily?: "primary" | "secondary";
  withArrow?: boolean;
  onClick?: () => void;
}

export default function Button({
  text,
  bgColor = "bg-verdant-500",
  fontColor = "text-white",
  fontFamily = "primary",
  withArrow = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-xl shadow-md transition-transform duration-200 ease-in-out hover:scale-105 ${bgColor} ${fontColor} font-${fontFamily} flex items-center gap-2`}
    >
      {text}
      {withArrow && (
        <Image src="/icons/arrow.svg" alt="Arrow Icon" width={16} height={16} />
      )}
    </button>
  );
}
