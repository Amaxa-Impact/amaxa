import React from "react";

const Footer = () => {
  return (
    <div className="flex flex-col h-[448px] relative">
      {/* Subscribe section */}
      <div className="flex flex-col p-10 bg-[#F5F2F2] rounded-[25px] h-[64.51%]">
        <div className="font-normal text-[16px] leading-[24px] text-[#3B3B3B] mb-8">
          STAY IN THE LOOP
        </div>

        <h2 className="font-normal text-[48px] leading-[60px] text-[#3B3B3B] mb-8 max-w-[1031px]">
          Subscribe to our{" "}
          <span className="font-semibold">highly reviewed</span> newsletter.
        </h2>

        <div className="flex flex-row items-center justify-between max-w-[1031px]">
          <p className="font-normal text-[32px] leading-[40px] text-[#3B3B3B]">
            We promise it's worth your while.
          </p>

          <button className="flex items-center justify-center py-[12px] px-[28px] bg-white border border-[#3B3B3B] rounded-[25px]">
            <span className="font-normal text-[20px] leading-[24px] text-[#3B3B3B]">
              Subscribe now →
            </span>
          </button>
        </div>
      </div>

      {/* Footer text section */}
      <div className="flex flex-col bg-white h-[35.49%] p-10">
        <div className="flex flex-row items-center justify-between">
          {/* Logo */}
          <div className="w-[124px] h-[31px]">
            <img src="/amaxa.png" alt="ámaxa logo" className="w-full h-full" />
          </div>

          {/* Main navigation */}
          <div className="flex flex-row items-center gap-10">
            <a
              href="#"
              className="font-normal text-[16px] leading-[24px] text-black"
            >
              Explore Projects
            </a>
            <a
              href="#"
              className="font-normal text-[16px] leading-[24px] text-black"
            >
              Our Programs
            </a>
            <a
              href="#"
              className="font-normal text-[16px] leading-[24px] text-black"
            >
              Who We Are
            </a>
            <a
              href="#"
              className="font-normal text-[16px] leading-[24px] text-black"
            >
              Support Us
            </a>
            <a
              href="#"
              className="font-normal text-[16px] leading-[24px] text-black"
            >
              Our Blog
            </a>
            <a
              href="#"
              className="font-normal text-[16px] leading-[24px] text-black"
            >
              Contact Us
            </a>
          </div>

          {/* Legal links */}
          <div className="flex flex-row items-center gap-5">
            <a
              href="#"
              className="font-normal text-[16px] leading-[24px] text-black"
            >
              Terms of Use
            </a>
            <a
              href="#"
              className="font-normal text-[16px] leading-[24px] text-black"
            >
              Privacy Policy
            </a>
          </div>
        </div>

        {/* Nonprofit status */}
        <p className="font-normal text-[16px] leading-[24px] text-black mt-5 ml-[207px]">
          Ámaxa is a 501(c)(3) nonprofit.
        </p>
      </div>
    </div>
  );
};

export default Footer;
