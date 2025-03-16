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
        className="inline-flex items-center px-5 sm:px-6 md:px-8 py-2 md:py-3 rounded-full bg-[#b9d66e] text-gray-800 font-medium hover:bg-[#a8c55f] transition-colors text-sm md:text-base"
        onClick={onClick}
      >
        {children}
      </button>
    )
  } else if (variant === "black") {
    return (
      <Button className="rounded-[3rem] inline-flex items-center px-5 sm:px-6 md:px-8 py-2 md:py-3 font-medium transition-colors text-sm md:text-base"
        onClick={onClick}>
        Apply Now</Button>

    )
  } else if (variant === "long") {
    return (
      <button
        className="w-full border bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-6 rounded-[24px] transition-colors duration-200 flex justify-between items-center"
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
