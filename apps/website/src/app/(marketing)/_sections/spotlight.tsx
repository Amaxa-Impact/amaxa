import React from 'react'
import { SpotlightData } from '~/lib/projects'

export const Spotlight = (props: {
  spotlightData: SpotlightData
}) => {
  const { spotlightData } = props
  return (
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
      <div className="flex justify-center items-center w-full">
  <div className="relative w-full max-w-3xl">
    <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
      <iframe
        src={spotlightData.videoUrl}
        className="absolute top-0 left-0 w-full h-full"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
        allowFullScreen
        
      />
    </div>
  </div>
</div>

      
    </section>

    
  )
}
