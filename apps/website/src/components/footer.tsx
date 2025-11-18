"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Facebook, Globe, Instagram, Linkedin, Music2, BookOpen, Mail } from "lucide-react";
import { Button } from "@amaxa/ui/button";
import { Input } from "@amaxa/ui/input";

// Typewriter hook for animated text
const useTypewriter = (
  texts: string[],
  typingSpeed = 50,
  deletingSpeed = 30,
  delayAfterTyping = 2000,
) => {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentText = texts[currentIndex];

    if (isTyping) {
      // Typing phase
      if (displayedText === currentText) {
        // Finished typing, wait before deleting
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, delayAfterTyping);
      } else {
        // Continue typing
        timeout = setTimeout(() => {
          if (currentText) {
            setDisplayedText(
              currentText.substring(0, displayedText.length + 1),
            );
          }
        }, typingSpeed);
      }
    } else {
      // Deleting phase
      if (displayedText === "") {
        // Finished deleting, move to next text
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsTyping(true);
      } else {
        // Continue deleting
        timeout = setTimeout(() => {
          setDisplayedText(
            displayedText.substring(0, displayedText.length - 1),
          );
        }, deletingSpeed);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isTyping, currentIndex, texts, typingSpeed, deletingSpeed, delayAfterTyping]);

  return displayedText;
};

const Footer = () => {
  const newsletterTexts = [
    "Stay updated with our newsletter!",
  ];

  const typedText = useTypewriter(newsletterTexts, 50, 30, 2000);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add Airtable integration
    console.log("Newsletter signup submitted");
  };

  return (
    <footer className="w-full bg-black">
      {/* NEWSLETTER SECTION */}
      <div className="bg-white py-12 px-4 md:py-16">
        <div className="container mx-auto max-w-4xl">
          <h3 className="mb-6 min-h-[3rem] text-center text-2xl font-semibold text-black md:mb-8 md:min-h-[4rem] md:text-3xl">
            {typedText}
            <span className="animate-pulse">|</span>
          </h3>
          <form
            onSubmit={handleNewsletterSubmit}
            className="mx-auto flex max-w-lg flex-col gap-4 sm:flex-row sm:gap-3"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-full border border-[#3B3B3B] bg-white px-6 py-3 text-base text-[#3B3B3B] transition-colors focus:border-[#b9d66e] focus:outline-none focus:ring-2 focus:ring-[#b9d66e]/20"
              required
              aria-label="Email address for newsletter subscription"
            />
            <Button
              type="submit"
              className="box-border flex shrink-0 items-center justify-center rounded-full border border-[#3B3B3B] bg-[#b9d66e] px-6 py-3 text-base font-normal text-[#3B3B3B] transition-all hover:bg-[#a8c55f] hover:shadow-md md:px-8 md:text-lg"
            >
              Subscribe →
            </Button>
          </form>
        </div>
      </div>

      {/* MAIN FOOTER CONTENT */}
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16 lg:px-8">
        {/* FOOTER LINKS & BRAND */}
        <div className="mb-12 flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-center md:gap-8 lg:gap-10">
          {/* BRAND SECTION */}
          <div className="flex flex-col items-center text-center md:max-w-xs float-right: -right-50">
            <Link
              href="/"
              className="inline-block transition-opacity hover:opacity-80"
            >
              <span className="text-3xl font-bold text-white md:text-4xl">
                ámaxa
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-400 md:text-base">
              Empowering the next generation of changemakers
            </p>
          </div>

          {/* NAVIGATION LINKS */}
          <nav className="grid w-full grid-cols-2 gap-x-6 gap-y-3 text-sm md:w-auto md:grid-cols-3 md:gap-x-8 md:gap-y-4 lg:gap-x-12">
            <Link
              href="/who-we-are"
              className="text-center text-gray-300 transition-colors hover:text-white md:text-left"
            >
              Meet Ámaxa
            </Link>
            <Link
              href="/project"
              className="text-center text-gray-300 transition-colors hover:text-white md:text-left"
            >
              Discover Projects
            </Link>
            <Link
              href="/pathways"
              className="text-center text-gray-300 transition-colors hover:text-white md:text-left"
            >
              Explore Pathways
            </Link>
            <Link
              href="/project-stories"
              className="text-center text-gray-300 transition-colors hover:text-white md:text-left"
            >
              Our Stories
            </Link>
            <Link
              href="/contact-us"
              className="text-center text-gray-300 transition-colors hover:text-white md:text-left"
            >
              Contact Us
            </Link>
            <Link
              href="/support-us"
              className="text-center text-gray-300 transition-colors hover:text-white md:text-left"
            >
              Support Us
            </Link>
            <Link
              href="/blog"
              className="text-center text-gray-300 transition-colors hover:text-white md:text-left"
            >
              Our Blog
            </Link>
            <Link
              href="/terms"
              className="text-center text-gray-300 transition-colors hover:text-white md:text-left"
            >
              Terms of Use
            </Link>
            <Link
              href="/privacy"
              className="text-center text-gray-300 transition-colors hover:text-white md:text-left"
            >
              Privacy Policy
            </Link>
          </nav>
        </div>

        {/* CONTACT / SOCIAL LINKS - Below Grid */}
        <div className="mb-12 flex flex-col items-center gap-4">
          {/* Email with icon on same line */}
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-lg bg-white/10 text-white">
              <Mail className="size-3.5" />
            </div>
            <a
              href="mailto:lauren@amaxaimpact.org"
              className="text-xs font-medium text-white transition hover:text-[#b9d66e] sm:text-sm"
            >
              lauren@amaxaimpact.org
            </a>
          </div>
          {/* Social Links */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              href="https://www.instagram.com/amaxaimpact/?hl=en"
              target="_blank"
              rel="noreferrer"
              aria-label="Ámaxa on Instagram"
              className="flex size-7 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20 sm:size-6"
            >
              <Instagram className="size-3.5" />
            </Link>
            <Link
              href="https://www.facebook.com/amaxaimpact/"
              target="_blank"
              rel="noreferrer"
              aria-label="Ámaxa on Facebook"
              className="flex size-7 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20 sm:size-6"
            >
              <Facebook className="size-3.5" />
            </Link>
            <Link
              href="https://www.linkedin.com/company/amaxaimpact/posts/?feedView=all"
              target="_blank"
              rel="noreferrer"
              aria-label="Ámaxa on LinkedIn"
              className="flex size-7 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20 sm:size-6"
            >
              <Linkedin className="size-3.5" />
            </Link>
            <Link
              href="https://www.tiktok.com/@amaxaimpact"
              target="_blank"
              rel="noreferrer"
              aria-label="Ámaxa on TikTok"
              className="flex size-7 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20 sm:size-6"
            >
              <Music2 className="size-3.5" />
            </Link>
            <Link
              href="https://www.idealist.org/en/nonprofit/fd90e9561bf14721a2a4ef5518206678-amaxa-denver"
              target="_blank"
              rel="noreferrer"
              aria-label="Ámaxa on Idealist"
              className="flex size-7 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20 sm:size-6"
            >
              <Globe className="size-3.5" />
            </Link>
            <Link
              href="https://www.teenlife.com/l/enrichment/amaxa-impact-remote-volunteer-and-leadership-program/"
              target="_blank"
              rel="noreferrer"
              aria-label="Ámaxa on TeenLife"
              className="flex size-7 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20 sm:size-6"
            >
              <BookOpen className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Ámaxa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
