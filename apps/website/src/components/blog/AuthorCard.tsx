import React from 'react';

interface AuthorCardProps {
  name: string;
  avatar?: string;
  date: string;
  bio?: string;
}

export default function AuthorCard({ name, avatar, date, bio }: AuthorCardProps) {
  return (
    <div className="flex items-center space-x-4 py-6 border-t border-b border-gray-200 my-8">
      {avatar && (
        <div className="flex-shrink-0">
          <img
            src={avatar}
            alt={name}
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>
      )}
      <div className="flex-1">
        <h4 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">
          {name}
        </h4>
        <time className="text-sm text-gray-500" dateTime={date}>
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
        {bio && (
          <p className="text-sm text-gray-600 mt-2">{bio}</p>
        )}
      </div>
    </div>
  );
} 