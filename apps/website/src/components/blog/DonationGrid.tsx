import React from "react";
import Link from "next/link";

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

export function DonationGrid({
  title,
  organizations,
  description,
}: DonationGridProps) {
  return (
    <div className="my-6 rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-2 text-xl font-bold text-gray-900">{title}</h3>
      {description && <p className="mb-4 text-gray-600">{description}</p>}
      <div className="space-y-3">
        {organizations.map((org, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-md bg-gray-50 p-3"
          >
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
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-green-700"
            >
              Donate
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
