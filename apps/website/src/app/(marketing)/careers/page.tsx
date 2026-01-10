import type { CareerPost } from "@/lib/careers";
import CareersList from "@/components/careers/CareersList";
import { getAllCareerPosts } from "@/lib/careers";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function CareersPage() {
  // Fetch careers from Sanity
  let careers: CareerPost[] = [];
  try {
    careers = await getAllCareerPosts();
  } catch (error) {
    console.error("Error fetching careers:", error);
    // Continue with empty array if fetch fails
  }

  return (
    <main>
      {/* Header Section with Title with the default squiggly line */}
      <div className="relative flex max-h-[320px] w-full flex-col bg-white px-6 sm:max-h-[240px] md:max-h-[320px] md:px-12 lg:px-20">
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-6 md:px-16 lg:px-20">
            <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
              <div className="mb-12 max-w-full md:mb-0 md:max-w-3xl lg:max-w-4xl">
                <h1 className="text-4xl leading-tight font-light text-[#3B3B3B] md:text-4xl lg:text-6xl">
                  Careers
                </h1>

                {/* Green wavy line */}
                <div className="relative -mt-2 ml-auto h-6 w-48 md:-mt-4 md:w-64 lg:w-200">
                  <svg
                    viewBox="0 0 325 500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 41C1 41 54 10 81 41C108 72 162 10 189 41C216 72 270 41 270 41"
                      stroke="#BCD96C"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Main Content Section */}
      <section className="w-full bg-gray-50">
        <CareersList careers={careers} />
      </section>
    </main>
  );
}
