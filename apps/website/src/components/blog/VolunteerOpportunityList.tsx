import React from 'react';
import Image from 'next/image';
import { VolunteerOpportunity } from '../content/volunteer-opportunities/bridgeport';

interface VolunteerOpportunityListProps {
  opportunities: VolunteerOpportunity[];
}

const VolunteerOpportunityList: React.FC<VolunteerOpportunityListProps> = ({ opportunities }) => {
  return (
    <ol className="space-y-8">
      {opportunities.map((opportunity, index) => (
        <li key={index} className="pb-6 border-b border-gray-200 last:border-0">
          <div className="mb-2">
            <strong>
              <a href={opportunity.link} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                {opportunity.name}
              </a>
            </strong>
          </div>
          
          <p className="mb-4">{opportunity.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opportunity.images.map((image, imgIndex) => (
              <div key={imgIndex} className="relative">
                <Image 
                  src={image.src} 
                  alt={image.alt} 
                  width={600} 
                  height={400} 
                  className="rounded-lg shadow-md"
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                    aspectRatio: '3/2'
                  }}
                />
                <div className="text-xs text-gray-500 mt-1">
                  Photo Credit: <a href={image.creditLink} className="hover:underline" target="_blank" rel="noopener noreferrer">{image.credit}</a>
                </div>
              </div>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
};

export default VolunteerOpportunityList; 