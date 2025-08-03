import { ReactNode } from "react";
import Image from "next/image";

interface ServiceCardProps {
  imageUrl: string;
  header: ReactNode;
  paragraph: string;
  end: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ imageUrl, header, paragraph, end }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center w-full min-h-[400px] text-center px-6 gap-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} alt="Service" className="w-1/2" />
      <div className="md:w-1/2 text-left space-y-6">
        <h2 className="text-[2.3rem] text-shark-900 font-secondary font-medium w-3/4  leading-10">{header}</h2>
        <p className=" mt-2 text-gray-600 font-secondary-300 text-lg">{paragraph}</p>
        <div className="mt-4">
          <a href="#" className="text-verdant-600 font-semibold hover:underline flex items-center gap-1 text-lg">
            {end} <Image src="/icons/arrow-green.svg" width={24} height={24} alt="arrow-green"/>
          </a>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;
