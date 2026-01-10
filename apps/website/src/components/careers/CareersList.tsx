"use client";

import type { CareerPost } from "@/lib/careers";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/careers";
import { Briefcase, Heart, Search, Users } from "lucide-react";

import { cn } from "@amaxa/ui";
import { Button } from "@amaxa/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@amaxa/ui/card";
import { Input } from "@amaxa/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@amaxa/ui/tabs";

type CareerCategory =
  | "all"
  | "internship"
  | "volunteer"
  | "undergraduate-coach";

interface CareersListProps {
  careers: CareerPost[];
}

export default function CareersList({ careers }: CareersListProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<CareerCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter by search only, then sort by selected category
  const filteredAndSortedCareers = useMemo(() => {
    // Filter by search query only (all categories always shown)
    let filtered = careers.filter((career) => {
      const matchesSearch =
        searchQuery === "" ||
        career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        career.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        career.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    // Sort to show selected category first, then others
    if (selectedCategory !== "all") {
      filtered = filtered.sort((a, b) => {
        if (a.category === selectedCategory && b.category !== selectedCategory)
          return -1;
        if (a.category !== selectedCategory && b.category === selectedCategory)
          return 1;
        return 0;
      });
    }

    return filtered;
  }, [careers, selectedCategory, searchQuery]);

  // Category descriptions
  const categoryDescriptions: Record<string, string> = {
    internship:
      "Our internships are fully remote and currently unpaid, ranging from an internship period of 3-6 months. With opportunities like helping make these webpages you are seeing right now possible.",
    volunteer:
      "We are seeking long-term volunteers to take on active leadership roles within ámaxa.",
    "undergraduate-coach":
      "We match you to a team of students from across the world ages 14-18, guided by a trained undergraduate coach. Our 100% remote program is accessible across income and location.",
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "internship":
        return "Internships";
      case "volunteer":
        return "Volunteer Openings";
      case "undergraduate-coach":
        return "Undergraduate Coach";
      default:
        return category;
    }
  };

  // Group careers by category for display
  const groupedCareers = useMemo(() => {
    const groups: Record<string, CareerPost[]> = {
      internship: [],
      volunteer: [],
      "undergraduate-coach": [],
    };

    filteredAndSortedCareers.forEach((career) => {
      const categoryGroup = groups[career.category];
      if (categoryGroup) {
        categoryGroup.push(career);
      }
    });

    return groups;
  }, [filteredAndSortedCareers]);

  // Determine display order based on selected category
  const displayOrder: ("internship" | "volunteer" | "undergraduate-coach")[] =
    useMemo(() => {
      if (selectedCategory === "all") {
        return ["internship", "volunteer", "undergraduate-coach"];
      }
      const others = (
        ["internship", "volunteer", "undergraduate-coach"] as const
      ).filter((cat) => cat !== selectedCategory);
      return [selectedCategory, ...others];
    }, [selectedCategory]);

  // Banner images based on selected category
  const bannerImages: Record<
    CareerCategory,
    { src: string; alt: string; title: string; subtitle: string }
  > = {
    all: {
      src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOXM5a2R0BrawSs24LUuYDb5IoTiA7Feh0fPKW",
      alt: "Join our team and make an impact",
      title: "Join Our Mission to Create Change",
      subtitle:
        "Be part of a team that's making a real difference in the world",
    },
    internship: {
      src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=2000&h=800&fit=crop&q=80",
      alt: "Internship opportunities",
      title: "Start Your Career Journey",
      subtitle: "Gain real-world experience while making a meaningful impact",
    },
    "undergraduate-coach": {
      src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOFHSjHghMgGqJpRmLFNh4KsQWVrkiIwAYnPaz",
      alt: "Mentoring and coaching",
      title: "Mentor the Next Generation",
      subtitle:
        "Guide students from around the world in creating positive change",
    },
    volunteer: {
      src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOaifCsCIBDGmcbISEzQYZx81iL0rWJ43h2T9d",
      alt: "Volunteer opportunities",
      title: "Make an Impact as a Volunteer",
      subtitle: "Take on leadership roles and help drive our mission forward",
    },
  };

  const currentBanner = bannerImages[selectedCategory];

  return (
    <>
      {/* Full Width Banner Section */}
      <div className="relative h-64 w-full overflow-hidden md:h-96 lg:h-[500px]">
        <Image
          src={currentBanner.src}
          alt={currentBanner.alt}
          fill
          className={cn(
            "object-cover",
            selectedCategory === "internship" && "object-bottom",
          )}
          priority
          quality={95}
          sizes="100vw"
          unoptimized={currentBanner.src.includes("b47pkz22xs.ufs.sh")}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="max-w-4xl text-center text-white">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl xl:text-6xl">
              {currentBanner.title}
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl">
              {currentBanner.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-16 md:px-16 md:py-20 lg:px-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative mx-auto max-w-2xl">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search for positions, keywords, or skills..."
                className="h-12 rounded-full border-gray-200 bg-white pl-12 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Tabs - Centered */}
          <Tabs
            value={selectedCategory}
            onValueChange={(value) => {
              if (
                value === "all" ||
                value === "internship" ||
                value === "volunteer" ||
                value === "undergraduate-coach"
              ) {
                setSelectedCategory(value);
              }
            }}
            className="w-full"
            defaultValue="all"
          >
            <TabsList className="mb-12 flex h-auto w-full flex-wrap justify-center gap-3 bg-transparent p-0 md:gap-4">
              <TabsTrigger
                value="all"
                className="flex w-full cursor-pointer touch-manipulation items-center justify-center gap-2 rounded-full border border-[#3B3B3B] bg-white px-4 py-3 text-sm text-[#3B3B3B] transition-all hover:bg-gray-50 data-[state=active]:border-[#3B3B3B] data-[state=active]:bg-[#b9d66e] data-[state=active]:hover:bg-[#a8c55f] sm:w-auto sm:px-6 sm:text-base md:px-8 md:py-4 md:text-lg"
              >
                <span className="pointer-events-none">All</span>
              </TabsTrigger>
              <TabsTrigger
                value="internship"
                className="flex w-full cursor-pointer touch-manipulation items-center justify-center gap-2 rounded-full border border-[#3B3B3B] bg-white px-4 py-3 text-sm text-[#3B3B3B] transition-all hover:bg-gray-50 data-[state=active]:border-[#3B3B3B] data-[state=active]:bg-[#b9d66e] data-[state=active]:hover:bg-[#a8c55f] sm:w-auto sm:px-6 sm:text-base md:px-8 md:py-4 md:text-lg"
              >
                <Briefcase className="pointer-events-none h-4 w-4 shrink-0 md:h-5 md:w-5" />
                <span className="pointer-events-none hidden sm:inline">
                  Internships
                </span>
                <span className="pointer-events-none sm:hidden">Intern</span>
              </TabsTrigger>
              <TabsTrigger
                value="undergraduate-coach"
                className="flex w-full cursor-pointer touch-manipulation items-center justify-center gap-2 rounded-full border border-[#3B3B3B] bg-white px-4 py-3 text-sm text-[#3B3B3B] transition-all hover:bg-gray-50 data-[state=active]:border-[#3B3B3B] data-[state=active]:bg-[#b9d66e] data-[state=active]:hover:bg-[#a8c55f] sm:w-auto sm:px-6 sm:text-base md:px-8 md:py-4 md:text-lg"
              >
                <Users className="pointer-events-none h-4 w-4 shrink-0 md:h-5 md:w-5" />
                <span className="pointer-events-none hidden md:inline">
                  Undergraduate Coaches
                </span>
                <span className="pointer-events-none hidden sm:inline md:hidden">
                  Coach
                </span>
                <span className="pointer-events-none sm:hidden">Coach</span>
              </TabsTrigger>
              <TabsTrigger
                value="volunteer"
                className="flex w-full cursor-pointer touch-manipulation items-center justify-center gap-2 rounded-full border border-[#3B3B3B] bg-white px-4 py-3 text-sm text-[#3B3B3B] transition-all hover:bg-gray-50 data-[state=active]:border-[#3B3B3B] data-[state=active]:bg-[#b9d66e] data-[state=active]:hover:bg-[#a8c55f] sm:w-auto sm:px-6 sm:text-base md:px-8 md:py-4 md:text-lg"
              >
                <Heart className="pointer-events-none h-4 w-4 shrink-0 md:h-5 md:w-5" />
                <span className="pointer-events-none">Volunteer</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Content - Shows all categories but sorted by selected tab */}
          <div className="mt-0 space-y-12">
            {displayOrder.map((category) => {
              const categoryCareers = groupedCareers[category] ?? [];

              return (
                <div key={category} className="space-y-6">
                  {/* Category Header */}
                  <div className="space-y-2">
                    <h2 className="text-3xl font-normal text-[#3B3B3B] md:text-4xl">
                      {getCategoryLabel(category)}
                    </h2>
                    {categoryDescriptions[category] && (
                      <p className="max-w-4xl text-base text-[#3B3B3B] md:text-lg">
                        {categoryDescriptions[category]}
                      </p>
                    )}
                  </div>

                  {/* Career Cards or Empty State */}
                  {categoryCareers.length > 0 ? (
                    <div className="space-y-4">
                      {categoryCareers.map((career) => (
                        <Card
                          key={career._id}
                          className="overflow-hidden border-gray-200 bg-white transition-shadow hover:shadow-lg"
                        >
                          <div className="flex flex-col md:flex-row">
                            {/* Image Section */}
                            {career.mainImage?.asset ? (
                              <div className="relative h-48 w-full shrink-0 md:h-auto md:w-64 lg:w-80">
                                <Image
                                  src={urlFor(career.mainImage.asset)
                                    .width(800)
                                    .url()}
                                  alt={career.mainImage.alt || career.title}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, 320px"
                                />
                              </div>
                            ) : (
                              <div className="relative flex h-48 w-full shrink-0 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 md:h-auto md:w-64 lg:w-80">
                                <Briefcase className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                            {/* Content Section */}
                            <div className="flex flex-1 flex-col">
                              <CardHeader>
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                  <div className="flex-1 space-y-2">
                                    <CardTitle className="text-xl text-[#3B3B3B] md:text-2xl">
                                      {career.title}
                                    </CardTitle>
                                    {career.description && (
                                      <CardDescription className="text-base text-gray-600">
                                        {career.description}
                                      </CardDescription>
                                    )}
                                  </div>
                                  {career.applicationLink && (
                                    <Button
                                      variant="outline"
                                      className="w-full shrink-0 md:w-auto"
                                      asChild
                                    >
                                      <Link
                                        href={career.applicationLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        Apply Now
                                      </Link>
                                    </Button>
                                  )}
                                </div>
                              </CardHeader>
                              {career.slug?.current && (
                                <CardContent className="mt-auto">
                                  <Button
                                    variant="ghost"
                                    className="h-auto p-0 text-gray-600 hover:text-[#3B3B3B]"
                                    asChild
                                  >
                                    <Link
                                      href={`/careers/${career.slug.current}`}
                                    >
                                      Learn More →
                                    </Link>
                                  </Button>
                                </CardContent>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-dashed bg-white">
                      <CardHeader>
                        <CardDescription className="text-base text-gray-600">
                          Check back soon for new opportunities!
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
