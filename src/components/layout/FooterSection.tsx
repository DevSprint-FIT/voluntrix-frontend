import React from 'react'

const FooterSection = () => {
  return (
     <footer className="relative bg-white py-12 px-8 mt-16 border-t border-gray-200">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Branding Section */}
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2">
            <img src="/images/logo.svg" alt="Voluntrix Logo" className="h-6 w-6" />
            <h2 className="text-lg font-bold">Voluntrix</h2>
          </div>
          <p className="text-gray-600 mt-2">
            Empowering volunteers and organizations to create meaningful change together.
          </p>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-md font-semibold">Contact Us</h3>
          <p className="text-gray-600 mt-2">Email: support@voluntrix.com</p>
          <p className="text-gray-600">Phone: (+94) 71-456-7890</p>
        </div>

        {/* Newsletter Section */}
        <div>
          <h3 className="text-md font-semibold">Stay In Touch</h3>
          <p className="text-gray-600 mt-2">
            Subscribe to receive updates, access to exclusive features, and more.
          </p>
          <div className="mt-3 flex flex-col md:flex-row gap-2">
            <input type="email" placeholder="Email"  className="w-full md:w-auto border border-black px-3 py-2 rounded-md" />
            <button className="bg-black text-white rounded-md width={101} height={40}">Subscribe</button>
          </div>
        </div>
      </div>

        <br></br>
      <hr></hr>

    
     {/* Bottom Section */}
<div className="mt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
  <div className="text-center md:text-left">
    <p>© 2025 Voluntrix. All Rights Reserved.</p>
    <p>Designed & Developed by DevSprint</p>
  </div>

  {/* Links aligned to the right on larger screens */}
  <div className="mt-4 md:mt-0 flex space-x-6">
    <a href="#" className="hover:text-black">About</a>
    <a href="#" className="hover:text-black">Privacy Policy</a>
    <a href="#" className="hover:text-black">Terms of Service</a>
  </div>
</div>

      
      

     
    </footer>
  )
}

export default FooterSection