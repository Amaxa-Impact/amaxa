import React from "react";
import { ApplyButton } from "./apply";
import Link from "../../../../node_modules/next/link";

const Footer = () => {
  return (
    <div className="flex flex-col h-[448px] relative">
      {/* Subscribe section */}
      <div className="flex flex-col p-10 rounded-[25px] h-[64.51%] bg-[#b9d66e]">
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
  );
};

export default Footer;
