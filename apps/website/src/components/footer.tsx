import React from "react";
import Link from "next/link"; // Assuming you're using Next.js, otherwise use React Router

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200">
         <div className="flex flex-col relative bg-[#b9d66e] py-5">
      {/* Subscribe section */}
      <div className="flex flex-col p-10 rounded-[25px] h-[64.51%] ">
        <div className="font-normal text-[16px] leading-[24px] text-[#3B3B3B] mb-8">
          STAY IN THE LOOP
        </div>
        <h2 className="font-normal text-[48px] leading-[60px] text-[#3B3B3B] mb-8 max-w-[1031px]">
          Check out our{" "}
          <span className="font-semibold">highly reviewed</span> newsletter.
        </h2>
        {/* <div className="flex flex-row items-center justify-between max-w-[1031px]">
          <p className="font-normal text-[32px] leading-[40px] text-[#3B3B3B]">
            We promise it's worth your while.
          </p>
        </div> */}
        <div className="flex flex-row items-center justify-between max-w-[1031px]">
        <Link href="https://amaxaimpact.substack.com/subscribe?utm_source=email&utm_campaign=email-subscribe&r=1qhobc&next=https%3A%2F%2Famaxaimpact.substack.com%2Fp%2Fmarch-preview&utm_medium=email"   className="font-normal text-[24px] md:text-[24px] lg:text-[24px] leading-tight text-[#3B3B3B] hover:opacity-80 transition-opacity underline">
        Subscribe Now → 
        </Link>
      </div>    
    </div>
      {/* Footer text section */}
    </div>
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
