"use client";

import React from "react";
import Image from "next/image";

interface AuthorCardProps {
  name: string;
  avatar?: string;
  date: string;
  bio?: string;
}

export function AuthorCard({ name, avatar, date, bio }: AuthorCardProps) {
  return (
    <div className="my-8 flex items-center space-x-4 border-t border-b border-gray-200 py-6">
      {avatar && (
        <div className="flex-shrink-0">
          <Image
            src={avatar}
            alt={name}
            width={64}
            height={64}
            className="h-16 w-16 rounded-full object-cover"
          />
        </div>
      )}
      <div className="flex-1">
        <h4 className="text-lg font-semibold tracking-wide text-gray-900 uppercase">
          {name}
        </h4>
        <time className="text-sm text-gray-500" dateTime={date}>
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        {bio && <p className="mt-2 text-sm text-gray-600">{bio}</p>}
      </div>
    </div>
  );
}
