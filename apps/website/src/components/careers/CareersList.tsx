"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Briefcase, Users, Heart } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@amaxa/ui/card";
import { Button } from "@amaxa/ui/button";
import { Input } from "@amaxa/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@amaxa/ui/tabs";
import { urlFor } from "@/lib/careers";

type CareerCategory = "all" | "internship" | "volunteer" | "undergraduate-coach";

export interface CareerPost {
  _id: string;
  title: string;
  slug: { current: string };
  category: "internship" | "volunteer" | "undergraduate-coach";
  description?: string;
  body?: any;
  mainImage?: { asset: { _ref: string }; alt?: string };
  publishedAt: string;
  applicationLink?: string;
}

interface CareersListProps {
  careers: CareerPost[];
}

export default function CareersList({ careers }: CareersListProps) {
  const [selectedCategory, setSelectedCategory] = useState<CareerCategory>("all");
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
        if (a.category === selectedCategory && b.category !== selectedCategory) return -1;
        if (a.category !== selectedCategory && b.category === selectedCategory) return 1;
        return 0;
      });
    }

    return filtered;
  }, [careers, selectedCategory, searchQuery]);

  // Category descriptions
  const categoryDescriptions: Record<string, string> = {
    internship: "Our internships are fully remote and currently unpaid, ranging from an internship period of 3-6 months. With oppotunities like helping make these webpages you are seeing right now possible.",
    volunteer: "We are seeking long-term volunteers to take on active leadership roles within ámaxa.",
    "undergraduate-coach": "We match you to a team of students from across the world ages 14-18, guided by a trained undergraduate coach. Our 100% remote program is accessible across income and location.",
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
  const displayOrder: ("internship" | "volunteer" | "undergraduate-coach")[] = useMemo(() => {
    if (selectedCategory === "all") {
      return ["internship", "volunteer", "undergraduate-coach"];
    }
    const others = (["internship", "volunteer", "undergraduate-coach"] as const).filter(
      (cat) => cat !== selectedCategory
    );
    return [selectedCategory, ...others];
  }, [selectedCategory]);

  // Banner images based on selected category
  const bannerImages: Record<CareerCategory, { src: string; alt: string; title: string; subtitle: string }> = {
    all: {
      src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOXM5a2R0BrawSs24LUuYDb5IoTiA7Feh0fPKW",
      alt: "Join our team and make an impact",
      title: "Join Our Mission to Create Change",
      subtitle: "Be part of a team that's making a real difference in the world",
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
      subtitle: "Guide students from around the world in creating positive change",
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
      <div className="relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden">
        <Image
          src={currentBanner.src}
          alt={currentBanner.alt}
          fill
          className={`object-cover ${selectedCategory === "internship" ? "object-bottom" : ""}`}
          priority
          quality={95}
          sizes="100vw"
          unoptimized={currentBanner.src.includes("b47pkz22xs.ufs.sh")}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="text-center text-white max-w-4xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4">
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
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search for positions, keywords, or skills..."
                className="h-12 pl-12 text-lg rounded-full bg-white border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Tabs - Centered */}
          <Tabs
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value as CareerCategory)}
            className="w-full"
            defaultValue="all"
          >
            <TabsList className="flex flex-wrap w-full justify-center mb-12 gap-3 md:gap-4 bg-transparent p-0 h-auto">
          <TabsTrigger
            value="all"
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-full border border-[#3B3B3B] bg-white text-[#3B3B3B] transition-all hover:bg-gray-50 data-[state=active]:bg-[#b9d66e] data-[state=active]:border-[#3B3B3B] data-[state=active]:hover:bg-[#a8c55f] cursor-pointer touch-manipulation"
          >
            <span className="pointer-events-none">All</span>
          </TabsTrigger>
          <TabsTrigger
            value="internship"
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-full border border-[#3B3B3B] bg-white text-[#3B3B3B] transition-all hover:bg-gray-50 data-[state=active]:bg-[#b9d66e] data-[state=active]:border-[#3B3B3B] data-[state=active]:hover:bg-[#a8c55f] cursor-pointer touch-manipulation"
          >
            <Briefcase className="h-4 w-4 md:h-5 md:w-5 shrink-0 pointer-events-none" />
            <span className="hidden sm:inline pointer-events-none">Internships</span>
            <span className="sm:hidden pointer-events-none">Intern</span>
          </TabsTrigger>
          <TabsTrigger
            value="undergraduate-coach"
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-full border border-[#3B3B3B] bg-white text-[#3B3B3B] transition-all hover:bg-gray-50 data-[state=active]:bg-[#b9d66e] data-[state=active]:border-[#3B3B3B] data-[state=active]:hover:bg-[#a8c55f] cursor-pointer touch-manipulation"
          >
            <Users className="h-4 w-4 md:h-5 md:w-5 shrink-0 pointer-events-none" />
            <span className="hidden md:inline pointer-events-none">Undergraduate Coaches</span>
            <span className="hidden sm:inline md:hidden pointer-events-none">Coach</span>
            <span className="sm:hidden pointer-events-none">Coach</span>
          </TabsTrigger>
          <TabsTrigger
            value="volunteer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-full border border-[#3B3B3B] bg-white text-[#3B3B3B] transition-all hover:bg-gray-50 data-[state=active]:bg-[#b9d66e] data-[state=active]:border-[#3B3B3B] data-[state=active]:hover:bg-[#a8c55f] cursor-pointer touch-manipulation"
          >
            <Heart className="h-4 w-4 md:h-5 md:w-5 shrink-0 pointer-events-none" />
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
                    <h2 className="text-3xl md:text-4xl font-normal text-[#3B3B3B]">
                      {getCategoryLabel(category)}
                    </h2>
                    {categoryDescriptions[category] && (
                      <p className="text-base md:text-lg text-[#3B3B3B] max-w-4xl">
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
                          className="hover:shadow-lg transition-shadow bg-white border-gray-200 overflow-hidden"
                        >
                          <div className="flex flex-col md:flex-row">
                            {/* Image Section */}
                            {career.mainImage?.asset ? (
                              <div className="relative w-full md:w-64 lg:w-80 h-48 md:h-auto shrink-0">
                                <Image
                                  src={urlFor(career.mainImage.asset).width(800).url()}
                                  alt={career.mainImage.alt || career.title}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, 320px"
                                />
                              </div>
                            ) : (
                              <div className="relative w-full md:w-64 lg:w-80 h-48 md:h-auto shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <Briefcase className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                            {/* Content Section */}
                            <div className="flex-1 flex flex-col">
                              <CardHeader>
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                  <div className="flex-1 space-y-2">
                                    <CardTitle className="text-xl md:text-2xl text-[#3B3B3B]">
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
                                      className="w-full md:w-auto shrink-0"
                                      asChild
                                    >
                                      <Link href={career.applicationLink} target="_blank" rel="noopener noreferrer">
                                        Apply Now
                                      </Link>
                                    </Button>
                                  )}
                                </div>
                              </CardHeader>
                              {career.slug?.current && (
                                <CardContent className="mt-auto">
                                  <Button variant="ghost" className="p-0 h-auto text-gray-600 hover:text-[#3B3B3B]" asChild>
                                    <Link href={`/careers/${career.slug.current}`}>
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

