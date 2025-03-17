"use client"
import { Button } from '@amaxa/ui/button'
import { ArrowRight } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { usePostHog } from 'posthog-js/react'
import React from 'react'

export const ApplyButton = (props: {
  variant: "color" | "black" | "long" | "ghost"
  children: React.ReactNode
}) => {
  const { variant, children } = props
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();
  const router = useRouter();

  function onClick() {
    let url = window.origin + pathname;
    if (searchParams.toString()) {
      url = url + `?${searchParams.toString()}`;
    }
    posthog.capture("apply_button_clicked", {
      current_url: url,
    });
    router.push("https://airtable.com/appPR9mkslbn3U8YZ/shrHHUtRzK4DqKt3F");
  }

  if (variant === "color") {
    return (
      <button
        className="inline-flex items-center px-5 sm:px-6 md:px-8 py-2 md:py-3 rounded-full border-[1px] border-[#3B3B3B] bg-[#b9d66e] text-[#3B3B3B] font-light hover:bg-[#a8c55f] transition-colors text-sm md:text-base"
        onClick={onClick}
      >
        {children}
      </button>
    )
  } else if (variant === "black") {
    return (
      <button
        className="rounded-[3rem] inline-flex items-center px-5 sm:px-6 md:px-8 py-2 md:py-3 bg-[#3B3B3B] text-white font-light transition-colors text-sm md:text-base"
        onClick={onClick}
      >
        {children}
      </button>
    )
  } else if (variant === "long") {
    return (
      <button
        className="inline-flex items-center px-5 sm:px-6 md:px-8 py-2 md:py-3 mr-4 rounded-full border-[1px] border-[#3B3B3B] text-[#3B3B3B] font-light hover:bg-gray-100 transition-colors text-sm md:text-base"
      >
        <span>{children}</span>
        <div
        >
          <ArrowRight className="w-5 h-5" />
        </div>
      </button>
    )
  } else if (variant === "ghost") {
    return (
      <button
        className="font-normal text-[32px] md:text-[40px] lg:text-[48px] leading-tight text-black hover:opacity-80 transition-opacity"
        onClick={onClick}
      >
        {children}
      </button>
    )
  }
}



