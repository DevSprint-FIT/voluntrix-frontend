import { ReactNode } from "react";

interface ServiceCardProps {
  imageUrl: string;
  header: ReactNode;
  paragraph: string;
  end: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ imageUrl, header, paragraph, end }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center w-full min-h-[400px] text-center px-6 gap-8">
      <img src={imageUrl} alt="Service" className="w-1/2" />
      <div className="md:w-1/2 text-left">
        <h2 className="text-3xl text-shark-900 font-primary font-bold">{header}</h2>
        <p className="mt-2 text-gray-600 font-secondary-300">{paragraph}</p>
        <div className="mt-4">
          <a href="#" className="text-verdant-600 font-semibold hover:underline flex items-center gap-1">
            {end} <span className="text-lg">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;
