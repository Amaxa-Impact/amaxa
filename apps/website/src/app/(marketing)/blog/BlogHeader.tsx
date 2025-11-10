'use client'

import { AnimatedHeading } from '@/components/AnimatedHeading'

export function BlogHeader() {
  return (
    <div className="mb-16 text-center">
   
      <div className="inline-block mb-8">
        <span className="inline-block px-6 py-2 bg-white border-2 border-[#3B3B3B]/15 rounded-xl text-sm font-semibold text-[#3B3B3B] tracking-wider shadow-sm">
          BLOGS
        </span>
      </div>

      {/* Main Heading with Animation */}
      <AnimatedHeading
        text="Ámaxa - Insights & Inspiration"
        className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-[#3B3B3B] max-w-5xl mx-auto leading-tight"
      />

      {/* Subheading */}
      <p className="text-lg md:text-xl text-[#3B3B3B]/80 max-w-4xl mx-auto leading-relaxed">
      Explore articles on youth-led change, global issues, and projects making a real impact.
      </p>
    </div>
  )
}
