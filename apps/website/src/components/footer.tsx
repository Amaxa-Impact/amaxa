"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@amaxa/ui/button";
import { Input } from "@amaxa/ui/input";

const Footer = () => {
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add Airtable integration
    console.log("Newsletter signup submitted");
  };

  return (
    <footer className="w-full border-t border-gray-200 bg-black">
    {/* HERO NEWSLETTER SECTION */}
    <section
      className="h-[450px] w-full bg-cover bg-center py-16"
      style={{
        backgroundImage:
          'url("https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOf96x5gJwr1ELXMUHWOkNjK5T3SJYnup9ReGz")',
      }}
    >
      <div className="relative flex flex-col">
        <div className="flex flex-col rounded-[25px] p-10">
          <h2 className="mb-8 max-w-[1031px] bg-white p-5 text-[48px] font-normal leading-[60px] text-[#3B3B3B]">
            Check out our{" "}
            <span className="font-semibold">highly reviewed</span> newsletter.
          </h2>
          <div className="flex max-w-[1031px] flex-row items-center justify-between">
            <h2 className="mb-8 max-w-[1031px] bg-white p-5 text-[40px] font-normal leading-[60px] text-[#3B3B3B] underline">
              <Link href="https://amaxaimpact.substack.com/subscribe?utm_source=email&utm_campaign=email-subscribe&r=1qhobc&next=https%3A%2F%2Famaxaimpact.substack.com%2Fp%2Fmarch-preview&utm_medium=email">
                Subscribe Now →
              </Link>
            </h2>
          </div>
        </div>
      </div>
    </section>

      {/* MAIN FOOTER CONTENT */}
      <div className="container mx-auto py-6">
        {/* NEWSLETTER FORM SECTION */}
        <div className="mb-5 text-center">
          <h3 className="mb-5 text-2xl font-semibold text-white">
            Stay updated with our newsletter
          </h3>
          <form onSubmit={handleNewsletterSubmit} className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row text-xs">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white text-black"
              required
              aria-label="Email address for newsletter subscription"
            />
            <Button 
              type="submit"
              className="rounded-full border border-[#3B3B3B] bg-white px-8 py-3 hover:bg-gray-100"
            >
              <span className="text-base font-normal text-[#3B3B3B] text-xs">
                Subscribe →
              </span>
            </Button>
          </form>
        </div>

        {/* FOOTER LINKS & BRAND */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* BRAND SECTION */}
          <div className="text-center md:text-left">
            <Link href="/">
              <span className="text-3xl font-bold text-white">ámaxa</span>
            </Link>
            <p className="mt-5 text-sm text-gray-400">
              Empowering the next generation of changemakers
            </p>
          </div>

          {/* NAVIGATION LINKS */}
          <nav className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3 md:gap-6 lg:grid-cols-4 text-center text-balance">
            <Link href="/who-we-are" className="text-gray-300 hover:text-white">
              Meet Ámaxa
            </Link>
            <Link href="/project" className="text-gray-300 hover:text-white">
              Discover Projects
            </Link>
            <Link href="/pathways" className="text-gray-300 hover:text-white">
              Explore Pathways
            </Link>
            <Link href="/project-stories" className="text-gray-300 hover:text-white">
              Our Stories
            </Link>
            <Link href="/contact-us" className="text-gray-300 hover:text-white">
              Contact Us
            </Link>
            <Link href="/support-us" className="text-gray-300 hover:text-white">
              Support Us
            </Link>
            <Link href="/blog" className="text-gray-300 hover:text-white">
              Our Blog
            </Link>
            <Link href="/terms" className="text-gray-300 hover:text-white">
              Terms of Use
            </Link>
            <Link href="/privacy" className="text-gray-300 hover:text-white">
              Privacy Policy
            </Link>
          </nav>
        </div>

        {/* COPYRIGHT */}
        <div className="mt-5 border-t border-gray-700 pt-5 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Ámaxa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;