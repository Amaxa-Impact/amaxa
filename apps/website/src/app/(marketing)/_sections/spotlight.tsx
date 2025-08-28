import React from "react";
import Image from "next/image";

import type { SpotlightData } from "~/lib/projects";

export const Spotlight = (props: { spotlightData: SpotlightData }) => {
  const { spotlightData } = props;
  return (
    <section className="container mx-auto flex flex-col py-10 md:flex-row">
      {/* Left Section */}
      <div className="flex flex-col gap-5 p-4 md:w-2/4 lg:w-3/4">
        <h2 className="mb-2 text-sm font-bold uppercase text-gray-500">
          {spotlightData.heading}
        </h2>
        <div>
          <div className="flex flex-col gap-0">
            <h1 className="mb-1 text-4xl font-semibold">
              {spotlightData.name}
            </h1>
            <p className="mb-4 text-sm text-gray-600">
              {spotlightData.ageLocation}
            </p>
          </div>
          {spotlightData.paragraphs.map((p, i) => (
            <p key={i} className="mb-4 text-gray-700">
              {p}
            </p>
          ))}
          <p className="mt-4 font-semibold text-gray-700">
            {spotlightData.teammates}
          </p>
        </div>
      </div>
      {/* Right Section */}
      <div className="flex w-full items-center justify-center">
        <div className="relative h-full w-full">
          {spotlightData.videoUrl ? (
            <iframe
              src={spotlightData.videoUrl}
              className="relative h-full w-full"
              allowFullScreen
            />
          ) : spotlightData.imageUrl ? (
            <Image
              src={spotlightData.imageUrl}
              width={500}
              height={500}
              alt={spotlightData.name}
              className="mx-24 flex h-[700px] w-[500px] flex-col items-center justify-center rounded-lg shadow-md"
            />
          ) : (
            <div className="flex h-64 w-full items-center justify-center rounded-lg bg-gray-200 text-gray-500">
              No media available
            </div>
          )}
        </div>
        {/* <div className="relative w-full max-w-3xl">
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            <iframe
              src={spotlightData.videoUrl}
              className="absolute left-0 top-0 h-full w-full"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              allowFullScreen
            />
          </div>
        </div> */}
      </div>
    </section>
  );
};
