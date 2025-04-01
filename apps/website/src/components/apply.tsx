"use client";

import React, { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { usePostHog } from "posthog-js/react";

import { Button } from "@amaxa/ui/button";

const ApplyButtonContent = (props: {
  variant: "color" | "black" | "long" | "ghost";
  children: React.ReactNode;
}) => {
  const { variant, children } = props;
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
        className="inline-flex items-center rounded-[3rem] border-[1px] border-[#3B3B3B] bg-[#b9d66e] px-5 py-2 text-sm font-light text-[#3B3B3B] transition-colors hover:bg-[#a8c55f] sm:px-6 md:px-8 md:py-3 md:text-base"
        onClick={onClick}
      >
        {children}
      </button>
    );
  } else if (variant === "black") {
    return (
      <button
        className="inline-flex items-center rounded-[3rem] bg-[#3B3B3B] px-5 py-2 text-sm font-light text-white transition-colors sm:px-6 md:px-8 md:py-3 md:text-base"
        onClick={onClick}
      >
        {children}
      </button>
    );
  } else if (variant === "long") {
    return (
      <button className="mr-4 inline-flex items-center rounded-full border-[1px] border-[#3B3B3B] bg-white px-5 py-2 text-sm font-light text-[#3B3B3B] transition-colors hover:bg-gray-100 sm:px-6 md:px-8 md:py-3 md:text-base">
        <span>{children}</span>
        <div>
          <ArrowRight className="h-5 w-5" />
        </div>
      </button>
    );
  } else if (variant === "ghost") {
    return (
      <button
        className="text-[32px] font-normal leading-tight text-black transition-opacity hover:opacity-80 md:text-[40px] lg:text-[48px]"
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
};

export const ApplyButton = (props: {
  variant: "color" | "black" | "long" | "ghost";
  children: React.ReactNode;
}) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ApplyButtonContent {...props} />
    </Suspense>
  );
};
