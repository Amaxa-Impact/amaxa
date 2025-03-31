import React from "react";
import Image from "next/image";
import { TakeActionSection } from "./take-action";
import type { HomePageData } from "~/lib/projects";

interface GenericHomeProps {
  data: HomePageData;
}

export const GenericHome: React.FC<GenericHomeProps> = ({ data }) => {
  const {
    headerTitle,
    imageAlt,
    imageSrc,
    solutionTitle,
    solutionSubtitle,
    solutionParagraphs,
    spotlightData,
    spotlightData1,
  } = data;

  return (
    <main className="w-full min-h-screen">
      <header className={`py-20 px-10 `}>
        <div className="container mx-auto">
          <h1 className="text-5xl max-w-4xl text-[#3B3B3B]">{headerTitle}</h1>
        </div>
      </header>

      <section className="relative w-full min-h-[200px] md:min-h-[300px] lg:min-h-[400px]">
        <Image
          alt={imageAlt ?? "no image"}
          src={imageSrc}
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover"
        />
      </section>

      <section className="bg-[#3B3B3B] px-10 py-10">
        <div className="container mx-auto flex flex-col gap-[36px]">
          <h2 className="text-xl font-mono text-white">{solutionTitle}</h2>
          <h3 className="text-3xl text-white">{solutionSubtitle}</h3>
          {solutionParagraphs.map((paragraph, idx) => (
            <p key={idx} className="text-white">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="bg-[#F5F2F2] py-10">
        <TakeActionSection />
      </section>

      <section className="flex flex-col md:flex-row py-10 container mx-auto">
        {/* Left Section */}
        <div className="md:w-2/4 lg:w-3/4 p-4 flex flex-col gap-5">
          <h2 className="text-sm uppercase font-bold text-gray-500 mb-2">
            {spotlightData.heading}
          </h2>
          <div>
            <div className="flex flex-col gap-0">
              <h1 className="text-4xl font-semibold mb-1">
                {spotlightData.name}
              </h1>
              <p className="text-gray-600 text-sm mb-4">
                {spotlightData.ageLocation}
              </p>
            </div>
            {spotlightData.paragraphs.map((p, i) => (
              <p key={i} className="mb-4 text-gray-700">
                {p}
              </p>
            ))}
            <p className="font-semibold mt-4 text-gray-700">
              {spotlightData.teammates}
            </p>
          </div>
        </div>
        {/* Right Section */}
        {/* <div className="md:w-2/4 lg:w-3/4 flex justify-center items-center">
          <div className="relative w-full h-full">
            <iframe src={spotlightData.videoUrl} className="w-full h-full" />
          </div>
        </div> */}

         {/* Right: Video or Image */}
      <div className="md:w-2/4 lg:w-3/4 flex justify-center items-center">
        <div className="relative w-full h-full">
          {spotlightData.videoUrl ? (
            <iframe
              src={spotlightData.videoUrl}
              className="relative w-full h-full"
              allowFullScreen
            />
          ) : spotlightData.imageUrl ? (
            <Image
              src={spotlightData.imageUrl}
              width= {1000}
              height={1000}
              alt={spotlightData.name}
              className="w-full h-full rounded-lg shadow-md"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg">
              No media available
            </div>
          )}
        </div>
      </div>
      </section>
      {
        spotlightData1 ?
          <section>
            <div className="md:w-2/4 lg:w-3/4 p-4 flex flex-col gap-5">
              <h2 className="text-sm uppercase font-bold text-gray-500 mb-2">

                {spotlightData1.heading}
              </h2>
              <div>

                <div className="flex flex-col gap-0">
                  <h1 className="text-4xl font-semibold mb-1">
                    {spotlightData1.name}
                  </h1>
                  <p className="text-gray-600 text-sm mb-4">
                    {spotlightData1.ageLocation}
                  </p>
                </div>
                {spotlightData1.paragraphs.map((p, i) => (
                  <p key={i} className="mb-4 text-gray-700">
                    {p}
                  </p>
                ))}
                <p className="font-semibold mt-4 text-gray-700">
                  {spotlightData1.teammates}
                </p>
              </div>
            </div>

            {/* <div className="md:w-2/4 lg:w-3/4 flex justify-center items-center">
              <div className="relative w-full h-full">
                <iframe src={spotlightData1.videoUrl} className="w-full h-full" />
              </div>
            </div> */}

                 {/* Right: Video or Image */}
      <div className="md:w-2/4 lg:w-3/4 flex justify-center items-center">
        <div className="relative w-full h-auto">
          {spotlightData1.videoUrl ? (
            <iframe
              src={spotlightData1.videoUrl}
              className="w-full h-full"
              allowFullScreen
            />
          ) : spotlightData1.imageUrl ? (
            <Image
              src={spotlightData1.imageUrl}
              alt={spotlightData1.name}
              className="w-full h-full rounded-lg shadow-md"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg">
              No media available
            </div>
          )}
        </div>
      </div>



          </section>
          : null
      }
    </main>
  );
};
