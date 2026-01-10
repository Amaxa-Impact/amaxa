"use client";

import React from "react";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

import { testimonials } from "./data";

export function TestimonialsSection2() {
  return (
    <div>
      <AnimatedTestimonials testimonials={testimonials}></AnimatedTestimonials>
    </div>
  );
}
