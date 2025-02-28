import Image from "next/image";

export default function FooterSection() {
  return (
    <footer className="relative bg-white py-4 px-8 w-full" >
      <div className="container mx-auto w-[1200px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-32 text-center md:text-left ">
          {/* Branding Section */}
          <div className="w-full">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Image
                src="/images/logo.svg"
                alt="Voluntrix Logo"
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <h2 className="text-lg font-bold font-primary text-[18px] text-shark-700">
                Voluntrix
              </h2>
            </div>
            <p className="text-shark-400 mt-4 font-primary text-[14px] tracking-[0.2px]">
              Empowering volunteers and organizations to <br/> create meaningful change
              together.
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-md font-semibold font-primary text-[14px] tracking-[0.2px] text-shark-600">
              Contact Us
            </h3>
            <p className="text-shark-400 mt-2 text-[14px] font-primary">
              Email: support@voluntrix.com
            </p>
            <p className="text-shark-400 text-[14px] font-primary">
              Phone: (+94) 71-456-7890
            </p>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="text-md font-semibold font-primary text-[14px] text-shark-600">
              Stay In Touch
            </h3>
            <div className="w-64">
              <p className="text-shark-400 mt-2 font-primary text-[14px] tracking-[0.2px]">
                Subscribe to receive updates, access to exclusive features, and
                more.
              </p>
            </div>
            <div className="mt-3 flex flex-col md:flex-row gap-2 text-[14px] font-primary">
              <input
                type="email"
                placeholder="Email"
                className="w-full md:w-auto border border-shark-400 px-3 py-2 rounded-sm"
              />
              <button className="bg-shark-950 text-white rounded-md w-[100px] h-[40px] tracking-[0.2px]">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <hr className="border-t-2 mx-auto mt-16" />

        {/* Bottom Section */}
        <div className="w-full mt-4 flex md:flex-row items-center justify-between text-shark-400 text-sm">
          <div className="text-center md:text-left font-primary">
            <p className="text-[13px] ">© 2025 Voluntrix. All Rights Reserved.</p>
            <p className="text-[10px]">Designed & Developed by DevSprint</p>
          </div>

          {/* Links aligned to the right on larger screens */}
          <div className="mt-4 md:mt-0 flex space-x-6 font-primary text-[13px]">
            <a href="#" className="hover:text-shark-950">
              About
            </a>
            <a href="#" className="hover:text-shark-950">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-shark-950">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
