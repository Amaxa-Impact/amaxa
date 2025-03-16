import React from "react";
import Image from "next/image";

interface ProfileCardProps {
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
  imageAlt?: string;
  className?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  title,
  bio,
  imageUrl,
  imageAlt = "",
  className = "",
}) => {
  return (
    <div
      className={`bg-white overflow-hidden ${className}`}
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-4xl font-semibold text-gray-800 mb-2">{name}</h2>
          <p className="text-sm font-medium tracking-wider text-gray-600 uppercase mb-6">
            {title}
          </p>
          <p className="text-gray-700 leading-relaxed">{bio}</p>
        </div>
        <div className="md:w-1/2 h-64 md:h-auto relative">
          <Image
            src={imageUrl}
            alt={imageAlt || `Photo of ${name}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};
