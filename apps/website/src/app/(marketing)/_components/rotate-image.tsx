"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"

interface CirclingElementsProps {
  images: {
    src: string
  }[]
  radius?: number
  duration?: number
  activeIndex?: number
  className?: string
}

const CirclingElements: React.FC<CirclingElementsProps> = ({
  images,
  activeIndex = 0,
  className,
}) => {
  const totalImages = images.length
  const [offsets, setOffsets] = useState<number[]>([])

  useEffect(() => {
    // Assign each image an offset based on how far it is from activeIndex
    const newOffsets = images.map((_, index) => {
      return (index - activeIndex + totalImages) % totalImages
    })
    setOffsets(newOffsets || [])
  }, [activeIndex, images, totalImages])

  return (
    <div className={`relative w-full h-full ${className}`}>
      asdfasdf
      {images.map((img, index) => {
        const offsetVal = offsets[index]

        // Display only three images: left, center, right
        // offsetVal === 0 => primary (center)
        // offsetVal === 1 => next (one side)
        // offsetVal === totalImages - 1 => previous (other side)

        if (offsetVal === 0) {
          // Primary image
          return (
            <Image
              src={img.src}
              key={img.src}
              alt={"lat"}
              height={336}
              width={262}
              className="absolute w-[262px] h-[336px] left-[882px] top-[96px] rounded-[24px]"
            />
          )
        } else if (offsetVal === 1) {
          // Next image
          return (
            <Image
              src={img.src}
              height={139}
              width={95}
              key={img.src}
              alt={""}
              className="absolute w-[95px] h-[139px] left-[816px] top-[257px] rounded-[24px]"
            />
          )
        } else if (offsetVal === totalImages - 1) {
          // Previous image
          return (
            <Image
              height={139}
              width={97}
              src={img.src}
              alt={""}
              key={img.src}
              className="absolute w-[97px] h-[139px] left-[1105px] top-[257px] rounded-[24px]"
            />
          )
        } else {
          // Hide all other images
          return null
        }
      })}
    </div>
  )
}

export default CirclingElements
