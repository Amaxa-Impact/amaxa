import type React from "react";
import Image from "next/image";

import type { HomePageData } from "~/lib/projects";
import { TakeActionSection } from "./take-action";

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
    <main className="min-h-screen w-full">
      <header className={`px-10 py-20`}>
        <div className="container mx-auto">
          <h1 className="max-w-4xl text-5xl text-[#3B3B3B]">{headerTitle}</h1>
        </div>
      </header>

      <section className="relative min-h-[200px] w-full md:min-h-[300px] lg:min-h-[400px]">
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
          <h2 className="font-mono text-xl text-white">{solutionTitle}</h2>
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

      <section className="container mx-auto flex flex-col py-10 md:flex-row">
        {/* Left Section */}
        <div className="flex flex-col gap-5 p-4 md:w-2/4 lg:w-3/4">
          <h2 className="mb-2 text-sm font-bold text-gray-500 uppercase">
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
        {/* <div className="md:w-2/4 lg:w-3/4 flex justify-center items-center">
          <div className="relative w-full h-full">
            <iframe src={spotlightData.videoUrl} className="w-full h-full" />
          </div>
        </div> */}

        {/* Right: Video or Image */}
        <div className="flex items-center justify-center md:w-2/4 lg:w-3/4">
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
                width={1000}
                height={1000}
                alt={spotlightData.name}
                className="h-full w-full rounded-lg shadow-md"
              />
            ) : (
              <div className="flex h-64 w-full items-center justify-center rounded-lg bg-gray-200 text-gray-500">
                No media available
              </div>
            )}
          </div>
        </div>
      </section>
      {spotlightData1 ? (
        <section>
          <div className="flex flex-col gap-5 p-4 md:w-2/4 lg:w-3/4">
            <h2 className="mb-2 text-sm font-bold text-gray-500 uppercase">
              {spotlightData1.heading}
            </h2>
            <div>
              <div className="flex flex-col gap-0">
                <h1 className="mb-1 text-4xl font-semibold">
                  {spotlightData1.name}
                </h1>
                <p className="mb-4 text-sm text-gray-600">
                  {spotlightData1.ageLocation}
                </p>
              </div>
              {spotlightData1.paragraphs.map((p, i) => (
                <p key={i} className="mb-4 text-gray-700">
                  {p}
                </p>
              ))}
              <p className="mt-4 font-semibold text-gray-700">
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
          <div className="flex items-center justify-center md:w-2/4 lg:w-3/4">
            <div className="relative h-auto w-full">
              {spotlightData1.videoUrl ? (
                <iframe
                  src={spotlightData1.videoUrl}
                  className="h-full w-full"
                  allowFullScreen
                />
              ) : spotlightData1.imageUrl ? (
                <Image
                  src={spotlightData1.imageUrl}
                  alt={spotlightData1.name}
                  className="h-full w-full rounded-lg shadow-md"
                />
              ) : (
                <div className="flex h-64 w-full items-center justify-center rounded-lg bg-gray-200 text-gray-500">
                  No media available
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
};
