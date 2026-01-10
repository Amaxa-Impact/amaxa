"use client";

import React from "react";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

import { testimonials } from "./data";

export function TestimonialsSection() {
  return (
    <div className="mx-auto max-w-7xl px-6 md:px-16 lg:px-20">
      <AnimatedTestimonials testimonials={testimonials} />
    </div>
  );
}
