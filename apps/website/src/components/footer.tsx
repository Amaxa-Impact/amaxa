import React from "react";
import Link from "next/link"; // Assuming you're using Next.js, otherwise use React Router

const Footer = () => {
  return (
    <footer className="w-full  py-4 px-6 bg-white border-t border-gray-200">
      <div className="container py-8 mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <Link href="/">
            <span className="text-2xl font-bold text-black">ámaxa</span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0">
          <nav className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 text-sm md:text-base">
            <Link
              href="/explore-projects"
              className="text-gray-800 hover:text-gray-600"
            >
              Explore Projects
            </Link>
            <Link
              href="/our-programs"
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
            <Link
              href="/support-us"
              className="text-gray-800 hover:text-gray-600"
            >
              Support Us
            </Link>
            <Link href="/blog" className="text-gray-800 hover:text-gray-600">
              Our Blog
            </Link>
            <Link
              href="/contact-us"
              className="text-gray-800 hover:text-gray-600"
            >
              Contact Us
            </Link>
          </nav>

          <div className="md:ml-auto flex gap-6 text-sm">
            <Link href="/terms" className="text-gray-800 hover:text-gray-600">
              Terms of Use
            </Link>
            <Link href="/privacy" className="text-gray-800 hover:text-gray-600">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-4 text-sm text-gray-600">
        <p>Ámaxa is a 501(c)(3) nonprofit.</p>
      </div>
    </footer>
  );
};

export default Footer;
