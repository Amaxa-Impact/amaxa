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
    <div className={`overflow-hidden bg-white ${className}`}>
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-col justify-center p-8 md:w-1/2 md:p-12">
          <h2 className="mb-2 text-4xl font-semibold text-gray-800">{name}</h2>
          <p className="mb-6 text-sm font-medium uppercase tracking-wider text-gray-600">
            {title}
          </p>
          <p className="leading-relaxed text-gray-700">{bio}</p>
        </div>
        <div className="relative md:w-1/2">
          <div className="relative aspect-[4/3] h-full max-h-[600px] w-full">
            <Image
              src={imageUrl}
              alt={imageAlt || `Photo of ${name}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{
                objectFit: "cover", // This prevents stretching
                objectPosition: "center",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
