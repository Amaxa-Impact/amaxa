import React from "react";
import Image from "next/image";
import Link from "next/link";

import NavigationSection from "./nav";

export const Header = () => {
  return (
    <div className="flex flex-row items-center justify-evenly ">
      <Image src="/amaxa.png" alt="logo" width={100} height={100} />
      <NavigationSection />
      <div className="flex flex-row gap-4">
        <Link href={"/apply"} passHref>
          <button className="rounded-xl border border-black bg-black px-4 py-2 text-sm text-white transition duration-200 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]">
            Apply now
          </button>
        </Link>
        <Link href={"/sign-in"} passHref>
          <button className="rounded-xl border border-black bg-white px-4 py-2 text-sm text-black transition duration-200 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
};
