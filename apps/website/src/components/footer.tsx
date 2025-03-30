import React from "react";
import Link from "next/link"; // Assuming you're using Next.js, otherwise use React Router
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="w-full h-[450px] bg-black border-t border-gray-200 ">

    <section 
      className="w-full h-full py-16 md:py-244 bg-cover bg-center"
      style={{
        backgroundImage:
          'url("https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOf96x5gJwr1ELXMUHWOkNjK5T3SJYnup9ReGz")',
          
      }}>

   <div className="flex flex-col relative">
      <div className="flex flex-col p-10 rounded-[25px]">
        <h2 className="font-normal text-[48px] leading-[60px] text-[#3B3B3B] mb-8 max-w-[1031px] bg-white p-5  ">
          Check out our{" "}
          <span className="font-semibold">highly reviewed</span> newsletter.
        </h2>
        <div className="flex flex-row items-center justify-between max-w-[1031px]">
        <h2 className="font-normal text-[40px] leading-[60px] text-[#3B3B3B]  max-w-[1031px] bg-white underline p-5 mb-8">
        <Link 
        href="https://amaxaimpact.substack.com/subscribe?utm_source=email&utm_campaign=email-subscribe&r=1qhobc&next=https%3A%2F%2Famaxaimpact.substack.com%2Fp%2Fmarch-preview&utm_medium=email"   
       >
        Subscribe Now → 
        </Link>
        </h2>
        </div>
        
        </div>

    </div>

  </section>


      {/* NORMAL FOOTER */}

      <div className="container py-8 mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <Link href="/">
            <span className="text-2xl font-bold text-black">ámaxa</span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0">
          <nav className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 text-sm md:text-base">
            <Link
              href="/project"
              className="text-gray-800 hover:text-gray-600"
            >
              Explore Projects
            </Link>
            <Link
              href="/program"
              className="text-gray-800 hover:text-gray-600"
            >
              Our Programs
            </Link>
            <Link
              href="/who-we-are"
              className="text-gray-800 hover:text-gray-600"
            >
              Who We Are
            </Link>
            
            {/* <Link
              href="/contact-us"
              className="text-gray-800 hover:text-gray-600"
            >
              Our Platform
            </Link>  */} 

            <Link
              href="/support-us" className="text-gray-800 hover:text-gray-600">
              Support Us
            </Link>
            <Link href="/blog" className="text-gray-800 hover:text-gray-600">
              Our Blog
            </Link>

            {/* <Link
              href="/contact-us"
              className="text-gray-800 hover:text-gray-600"
            >
              Contact Us
            </Link>  */}
          {/* <div className="md:ml-auto flex gap-6 text-sm">
            <Link href="/terms" className="text-gray-800 hover:text-gray-600">
              Terms of Use
            </Link>
            <Link href="/privacy" className="text-gray-800 hover:text-gray-600">
              Privacy Policy
            </Link>
          </div> */}

          </nav>
        </div>
      </div>

      {/* <div className="container mx-auto mt-4 text-sm text-gray-600">
        <p>Ámaxa is a registered 501(c)(3) nonprofit.</p>
      </div> */}




    </footer>
  );
};

export default Footer;
