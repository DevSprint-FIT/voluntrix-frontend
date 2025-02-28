import Image from "next/image";

export default function FooterSection() {
  return (
    <footer className="relative bg-white py-4 px-8 w-full" >
      <div className="container mx-auto w-[1250px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-24 text-center md:text-left ">
          {/* Branding Section */}
          <div className="w-full">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Image
                src="/images/logo-700.svg"
                alt="Voluntrix Logo"
                width={125}
                height={120}
              />
              {/* <h2 className="text-lg font-bold font-primary text-[18px] text-shark-700">
                Voluntrix
              </h2> */}
            </div>
            <p className="text-shark-400 mt-4 font-secondary text-[14px] tracking-[0.2px]">
              Empowering volunteers and organizations to <br/> create meaningful change
              together.
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-md font-semibold font-primary text-md tracking-[0.2px] text-shark-600">
              Contact Us
            </h3>
            <p className="text-shark-400 mt-2 text-[14px] font-secondary">
              Email: support@voluntrix.com
            </p>
            <p className="text-shark-400 text-[14px] font-secondary">
              Phone: (+94) 71-456-7890
            </p>
          </div>

          {/* Newsletter Section */}
          <div >
            <h3 className="text-md font-semibold font-primary text-md text-shark-600">
              Stay In Touch
            </h3>
            <div className="w-64 font-secondary">
              <p className="text-shark-400 mt-2 font-secondary text-[14px] tracking-[0.2px]">
                Subscribe to receive updates, access to exclusive features, and
                more.
              </p>
            </div>
            <div className="flex items-center border border-shark-400 py-1 px-1 rounded-[40px] w-fit mt-2">
              <input
                type="email"
                placeholder="Email"
                className="outline-none bg-transparent px-4 text-shark-950 flex-1"
              />
              <button className="bg-shark-950 text-white text-sm font-primary px-4 py-2 rounded-[20px] shadow-md tracking-[1px]">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <hr className="border-t-1 mx-auto mt-16 border-shark-50" />

        {/* Bottom Section */}
        <div className="w-full mt-4 flex md:flex-row items-center justify-between text-shark-400 text-sm">
          <div className="text-center md:text-left font-secondary font-normal tracking-[0.5px]">
            <p className="text-[13px] ">© 2025 Voluntrix. All Rights Reserved.</p>
            <p className="text-[10px]">Designed & Developed by DevSprint</p>
          </div>

          {/* Links aligned to the right on larger screens */}
          <div className="mt-4 md:mt-0 flex space-x-6 font-secondary text-[13px]">
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
