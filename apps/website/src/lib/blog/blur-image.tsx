"use client";

import type { ImageProps } from "next/image";
import { useState } from "react";
import Image from "next/image";

export default function BlurImage(props: ImageProps) {
  const [loading, setLoading] = useState(true);
  const [src, setSrc] = useState(props.src);

  // Reset src when props.src changes by using key prop on parent
  // or handle it in onError
  return (
    <Image
      {...props}
      src={src}
      alt={props.alt}
      className={`${props.className} ${loading ? "blur-[2px]" : "blur-0"}`}
      onLoad={() => {
        setLoading(false);
      }}
      onError={() => {
        setSrc(`https://avatar.vercel.sh/${props.alt}`); // if the image fails to load, use the default avatar
      }}
    />
  );
}
