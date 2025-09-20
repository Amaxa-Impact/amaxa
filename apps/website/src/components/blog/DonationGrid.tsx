import React from 'react';
import Link from 'next/link';

interface DonationOrganization {
  name: string;
  url: string;
  description?: string;
}

interface DonationGridProps {
  title: string;
  organizations: DonationOrganization[];
  description?: string;
}

export default function DonationGrid({ title, organizations, description }: DonationGridProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 my-6">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 mb-4">{description}</p>
      )}
      <div className="space-y-3">
        {organizations.map((org, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div>
              <h4 className="font-medium text-gray-900">{org.name}</h4>
              {org.description && (
                <p className="text-sm text-gray-600">{org.description}</p>
              )}
            </div>
            <Link
              href={org.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Donate
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
} 