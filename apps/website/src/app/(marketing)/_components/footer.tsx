import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="gap-4 p-4 px-8 py-16 sm:pb-16 md:flex md:justify-between">
      <div className="mb-12 flex flex-col gap-4">
        <Link className="flex items-center gap-2" href="/">
          <div />
          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
            ámaxa
          </span>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-10">
        <div>
          <h2 className="mb-6 text-sm font-medium uppercase tracking-tighter text-gray-900 dark:text-white">
            Product
          </h2>
          <ul className="grid gap-2">
            <li>
              <a
                className="cursor-pointer text-sm font-[450] text-gray-400 duration-200 hover:text-gray-200"
                href="/platform"
              >
                Web Platform
              </a>
            </li>
            <li>
              <a
                className="cursor-pointer text-sm font-[450] text-gray-400 duration-200 hover:text-gray-200"
                href="/pricing"
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                className="cursor-pointer text-sm font-[450] text-gray-400 duration-200 hover:text-gray-200"
                href="/faq"
              >
                FAQ
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-6 text-sm font-medium uppercase tracking-tighter text-gray-900 dark:text-white">
            Community
          </h2>
          <ul className="grid gap-2">
            <li>
              <a
                className="cursor-pointer text-sm font-[450] text-gray-400 duration-200 hover:text-gray-200"
                href="/"
              >
                Twitter
              </a>
            </li>
            <li>
              <a className="cursor-pointer text-sm font-[450] text-gray-400 duration-200 hover:text-gray-200">
                Email
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-6 text-sm font-medium uppercase tracking-tighter text-gray-900 dark:text-white">
            Legal
          </h2>
          <ul className="grid gap-2">
            <li>
              <a
                className="cursor-pointer text-sm font-[450] text-gray-400 duration-200 hover:text-gray-200"
                href="/terms"
              >
                Terms
              </a>
            </li>
            <li>
              <a
                className="cursor-pointer text-sm font-[450] text-gray-400 duration-200 hover:text-gray-200"
                href="/privacy"
              >
                Privacy
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
