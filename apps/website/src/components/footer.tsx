import React from "react";

const Footer = () => {
  return (
    <div className="relative h-[448px]">
      {/* Subscribe section */}
      <div className="absolute left-0 right-0 top-0 bottom-[35.49%] bg-[#F5F2F2] rounded-[25px]">
        <div className="absolute w-[1180px] h-[23px] left-[50px] top-[36px] font-['Geist'] font-normal text-[16px] leading-[24px] text-[#3B3B3B]">
          STAY IN THE LOOP
        </div>

        <h2 className="absolute w-[1031px] h-[61px] left-[50px] top-[95px] font-['Geist'] font-normal text-[48px] leading-[60px] text-[#3B3B3B]">
          Subscribe to our{" "}
          <span className="font-semibold">highly reviewed</span> newsletter.
        </h2>

        <p className="absolute w-[1031px] h-[61px] left-[50px] top-[192px] font-['Geist'] font-normal text-[32px] leading-[40px] text-[#3B3B3B]">
          We promise it's worth your while.
        </p>

        <button className="absolute box-border flex flex-row justify-center items-center py-[12px] px-[28px] gap-[11px] w-[220px] h-[48px] left-[589px] top-[192px] bg-white border border-[#3B3B3B] rounded-[25px]">
          <span className="w-[164px] h-[24px] font-['Geist'] font-normal text-[20px] leading-[24px] text-[#3B3B3B]">
            Subscribe now →
          </span>
        </button>
      </div>

      {/* Footer text section */}
      <div className="absolute left-0 right-0 top-[64.51%] bottom-0 bg-white">
        {/* Logo */}
        <div className="absolute w-[124px] h-[31px] left-[34px] top-[50px]">
          <img src="/amaxa.png" alt="ámaxa logo" className="w-full h-full" />
        </div>

        {/* Main navigation */}
        <div className="absolute flex flex-row justify-center items-center p-[10px] gap-[10px] w-[612px] h-[44px] left-[233px] top-[44px]">
          <a
            href="#"
            className="font-['Geist'] font-normal text-[16px] leading-[24px] text-black"
          >
            Explore Projects
          </a>
          <a
            href="#"
            className="font-['Geist'] font-normal text-[16px] leading-[24px] text-black"
          >
            Our Programs
          </a>
          <a
            href="#"
            className="font-['Geist'] font-normal text-[16px] leading-[24px] text-black"
          >
            Who We Are
          </a>
          <a
            href="#"
            className="font-['Geist'] font-normal text-[16px] leading-[24px] text-black"
          >
            Support Us
          </a>
          <a
            href="#"
            className="font-['Geist'] font-normal text-[16px] leading-[24px] text-black"
          >
            Our Blog
          </a>
          <a
            href="#"
            className="font-['Geist'] font-normal text-[16px] leading-[24px] text-black"
          >
            Contact Us
          </a>
        </div>

        {/* Legal links */}
        <div className="absolute flex flex-row justify-center items-center p-[10px] gap-[10px] w-[228px] h-[44px] left-[966px] top-[44px]">
          <a
            href="#"
            className="font-['Geist'] font-normal text-[16px] leading-[24px] text-black"
          >
            Terms of Use
          </a>
          <a
            href="#"
            className="font-['Geist'] font-normal text-[16px] leading-[24px] text-black"
          >
            Privacy Policy
          </a>
        </div>

        {/* Nonprofit status */}
        <p className="absolute w-[220px] h-[24px] left-[241px] top-[95px] font-['Geist'] font-normal text-[16px] leading-[24px] text-black">
          Ámaxa is a 501(c)(3) nonprofit.
        </p>
      </div>
    </div>
  );
};

export default Footer;
