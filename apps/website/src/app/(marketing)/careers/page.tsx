"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, Briefcase, Users, Heart, DollarSign } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@amaxa/ui/card";
import { Button } from "@amaxa/ui/button";
import { Input } from "@amaxa/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@amaxa/ui/tabs";
import { Badge } from "@amaxa/ui/badge";
import { Separator } from "@amaxa/ui/separator";

export default function CareersPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const positions = [
    {
      id: 1,
      title: "Marketing Intern",
      category: "internship",
      description: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Program Coordinator Coach",
      category: "coach",
      description: "Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "Community Outreach Volunteer",
      category: "volunteer",
      description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat.",
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      title: "Development Manager",
      category: "paid",
      description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam.",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop",
    },
    {
      id: 5,
      title: "Social Media Intern",
      category: "internship",
      description: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur magni dolores eos qui.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    },
    {
      id: 6,
      title: "Youth Mentor Coach",
      category: "coach",
      description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
    },
  ];

  const filteredPositions = positions.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main>
      {/* Header Section with Title with the default sqrig line*/}
      <div className="relative flex max-h-[320px] w-full flex-col bg-white px-6 sm:max-h-[240px] md:max-h-[320px] md:px-12 lg:px-20">
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-6 md:px-16 lg:px-20">
            <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
              <div className="mb-12 max-w-full md:mb-0 md:max-w-3xl lg:max-w-4xl">
                <h1 className="text-4xl font-light leading-tight text-[#3B3B3B] md:text-4xl lg:text-6xl">
                  Careers
                </h1>

                {/* Green wavy line */}
                <div className="lg:w-200 relative -mt-2 ml-auto h-6 w-48 md:-mt-4 md:w-64">
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

      {/* OPTION 1: Card-based Grid with Category Filters */}
      <section className="w-full bg-gray-50 px-6 py-16 md:px-16 md:py-20 lg:px-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-normal text-[#3B3B3B] md:text-4xl lg:text-5xl mb-4">
              Option 1: Card Grid Layout
            </h2>
            <p className="text-lg text-[#3B3B3B] md:text-xl">
              Explore opportunities through our interactive card grid
            </p>
          </div>

          {/* Category Filter Buttons */}
          <div className="mb-8 flex flex-wrap justify-center gap-4">
            <Button
              variant={selectedCategory === "all" ? "primary" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className="rounded-full"
            >
              All Positions
            </Button>
            <Button
              variant={selectedCategory === "internship" ? "primary" : "outline"}
              onClick={() => setSelectedCategory("internship")}
              className="rounded-full"
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Internships
            </Button>
            <Button
              variant={selectedCategory === "coach" ? "primary" : "outline"}
              onClick={() => setSelectedCategory("coach")}
              className="rounded-full"
            >
              <Users className="mr-2 h-4 w-4" />
              Coach Roles
            </Button>
            <Button
              variant={selectedCategory === "volunteer" ? "primary" : "outline"}
              onClick={() => setSelectedCategory("volunteer")}
              className="rounded-full"
            >
              <Heart className="mr-2 h-4 w-4" />
              Volunteer
            </Button>
            <Button
              variant={selectedCategory === "paid" ? "primary" : "outline"}
              onClick={() => setSelectedCategory("paid")}
              className="rounded-full"
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Paid Roles
            </Button>
          </div>

          {/* Card Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPositions.map((position) => (
              <Card key={position.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 w-full">
                  <Image
                    src={position.image}
                    alt={position.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl">{position.title}</CardTitle>
                    <Badge variant="secondary" className="capitalize">
                      {position.category}
                    </Badge>
                  </div>
                  <CardDescription className="text-base">
                    {position.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="my-16">
        <Separator />
      </div>

      {/* OPTION 2: Tabbed Interface with Search */}
      <section className="w-full px-6 py-16 md:px-16 md:py-20 lg:px-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-normal text-[#3B3B3B] md:text-4xl lg:text-5xl mb-4">
              Option 2: Tabbed Search Interface
            </h2>
            <p className="text-lg text-[#3B3B3B] md:text-xl">
              Browse by category with integrated search functionality
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative mx-auto max-w-2xl">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search for positions, keywords, or skills..."
                className="pl-10 h-12 text-lg rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="internship" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="internship" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Internships
              </TabsTrigger>
              <TabsTrigger value="coach" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Coach Roles
              </TabsTrigger>
              <TabsTrigger value="volunteer" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Volunteer
              </TabsTrigger>
              <TabsTrigger value="paid" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Paid Roles
                <Badge variant="secondary" className="ml-1">Soon</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="internship" className="space-y-4">
              {positions.filter(p => {
                const matchesCategory = p.category === "internship";
                const matchesSearch = searchQuery === "" || 
                  p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.category.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesCategory && matchesSearch;
              }).map((position) => (
                <Card key={position.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{position.title}</CardTitle>
                        <CardDescription className="text-base">
                          {position.description}
                        </CardDescription>
                      </div>
                      <Button variant="outline">Apply</Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="coach" className="space-y-4">
              {positions.filter(p => {
                const matchesCategory = p.category === "coach";
                const matchesSearch = searchQuery === "" || 
                  p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.category.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesCategory && matchesSearch;
              }).map((position) => (
                <Card key={position.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{position.title}</CardTitle>
                        <CardDescription className="text-base">
                          {position.description}
                        </CardDescription>
                      </div>
                      <Button variant="outline">Apply</Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="volunteer" className="space-y-4">
              {positions.filter(p => {
                const matchesCategory = p.category === "volunteer";
                const matchesSearch = searchQuery === "" || 
                  p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.category.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesCategory && matchesSearch;
              }).map((position) => (
                <Card key={position.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{position.title}</CardTitle>
                        <CardDescription className="text-base">
                          {position.description}
                        </CardDescription>
                      </div>
                      <Button variant="outline">Apply</Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="paid" className="space-y-4">
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-2xl mb-2">Paid Positions Coming Soon</CardTitle>
                  <CardDescription className="text-base">
                    We're working on expanding our team with paid positions. Check back soon or reach out to careers@amaxaimpact.org for updates.
                  </CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <div className="my-16">
        <Separator />
      </div>

      {/* OPTION 3: Hero + Similar to Apple/Microsoft's Style*/}
      <section className="w-full px-6 py-16 md:px-16 md:py-20 lg:px-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-normal text-[#3B3B3B] md:text-4xl lg:text-5xl mb-4">
              Option 3: Hero Category Sections
            </h2>
            <p className="text-lg text-[#3B3B3B] md:text-xl">
              Large visual sections for each opportunity type
            </p>
          </div>

          {/* Hero Search Section */}
          <div className="relative mb-16 h-96 w-full overflow-hidden rounded-lg">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop"
              alt="Team collaboration"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white">
              <h3 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
                Find Your Opportunity
              </h3>
              <p className="mb-8 max-w-2xl text-lg md:text-xl">
                Join a team dedicated to making real change in the world
              </p>
              <div className="relative w-full max-w-2xl">
                <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search all positions..."
                  className="h-14 pl-12 text-lg rounded-full bg-white/95"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Category Sections */}
          <div className="space-y-12">
            {/* Internships Section */}
            <div className="relative overflow-hidden rounded-lg">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-96">
                  <Image
                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop"
                    alt="Internships"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center bg-gray-50 p-8 md:p-12">
                  <Badge className="mb-4 w-fit">Internships</Badge>
                  <h3 className="mb-4 text-3xl font-bold text-[#3B3B3B] md:text-4xl">
                    Start Your Journey
                  </h3>
                  <p className="mb-6 text-lg leading-relaxed text-[#3B3B3B]">
                    Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation.
                  </p>
                  <div className="space-y-3">
                    {positions.filter(p => p.category === "internship").slice(0, 2).map((pos) => (
                      <div key={pos.id} className="flex items-center justify-between border-b pb-3">
                        <span className="font-medium">{pos.title}</span>
                        <Button variant="link" size="sm">View →</Button>
                      </div>
                    ))}
                  </div>
                  <Button className="mt-6 w-full md:w-auto" variant="outline">
                    View All Internships
                  </Button>
                </div>
              </div>
            </div>

            {/* Coach Roles Section */}
            <div className="relative overflow-hidden rounded-lg">
              <div className="grid md:grid-cols-2">
                <div className="order-2 flex flex-col justify-center bg-gray-50 p-8 md:order-1 md:p-12">
                  <Badge className="mb-4 w-fit">Coach Roles</Badge>
                  <h3 className="mb-4 text-3xl font-bold text-[#3B3B3B] md:text-4xl">
                    Mentor the Next Generation
                  </h3>
                  <p className="mb-6 text-lg leading-relaxed text-[#3B3B3B]">
                    Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit.
                  </p>
                  <div className="space-y-3">
                    {positions.filter(p => p.category === "coach").slice(0, 2).map((pos) => (
                      <div key={pos.id} className="flex items-center justify-between border-b pb-3">
                        <span className="font-medium">{pos.title}</span>
                        <Button variant="link" size="sm">View →</Button>
                      </div>
                    ))}
                  </div>
                  <Button className="mt-6 w-full md:w-auto" variant="outline">
                    View All Coach Roles
                  </Button>
                </div>
                <div className="relative order-1 h-64 md:order-2 md:h-96">
                  <Image
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
                    alt="Coach roles"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Volunteer Section */}
            <div className="relative overflow-hidden rounded-lg">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-96">
                  <Image
                    src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop"
                    alt="Volunteer"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center bg-gray-50 p-8 md:p-12">
                  <Badge className="mb-4 w-fit">Volunteer</Badge>
                  <h3 className="mb-4 text-3xl font-bold text-[#3B3B3B] md:text-4xl">
                    Make an Impact
                  </h3>
                  <p className="mb-6 text-lg leading-relaxed text-[#3B3B3B]">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident.
                  </p>
                  <div className="space-y-3">
                    {positions.filter(p => p.category === "volunteer").slice(0, 2).map((pos) => (
                      <div key={pos.id} className="flex items-center justify-between border-b pb-3">
                        <span className="font-medium">{pos.title}</span>
                        <Button variant="link" size="sm">View →</Button>
                      </div>
                    ))}
                  </div>
                  <Button className="mt-6 w-full md:w-auto" variant="outline">
                    View All Volunteer Positions
                  </Button>
                </div>
              </div>
            </div>

            {/* Paid Roles Section (Coming Soon) */}
            <div className="relative overflow-hidden rounded-lg border-2 border-dashed">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 bg-gray-100 md:h-96">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <DollarSign className="h-24 w-24 text-gray-300" />
                  </div>
                </div>
                <div className="flex flex-col justify-center bg-gray-50 p-8 md:p-12">
                  <Badge variant="secondary" className="mb-4 w-fit">Coming Soon</Badge>
                  <h3 className="mb-4 text-3xl font-bold text-[#3B3B3B] md:text-4xl">
                    Paid Positions
                  </h3>
                  <p className="mb-6 text-lg leading-relaxed text-[#3B3B3B]">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa quae ab illo inventore.
                  </p>
                  <Button className="w-full md:w-auto" variant="outline" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="my-16">
        <Separator />
      </div>

      {/* OPTION 4: Spotlight Style (Like Our Stories Page) */}
      <section className="w-full px-6 py-16 md:px-16 md:py-20 lg:px-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-normal text-[#3B3B3B] md:text-4xl lg:text-5xl mb-4">
              Option 4: Spotlight Style Layout
            </h2>
            <p className="text-lg text-[#3B3B3B] md:text-xl">
              Detailed stories and descriptions for each opportunity type
            </p>
          </div>
        </div>

        {/* Internships Spotlight */}
        <section className="container mx-auto flex flex-col py-10 md:flex-row">
          <div className="flex flex-col gap-5 p-4 md:w-2/4 lg:w-3/4">
            <h2 className="mb-2 text-sm font-bold uppercase text-gray-500">
              INTERNSHIP OPPORTUNITIES
            </h2>
            <div>
              <div className="flex flex-col gap-0">
                <h1 className="mb-1 text-4xl font-semibold">
                  Marketing & Communications Intern
                </h1>
                <p className="mb-4 text-sm text-gray-600">
                  Remote • Part-time • 3-6 months
                </p>
              </div>
              <p className="mb-4 text-gray-700">
                Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="mb-4 text-gray-700">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <p className="mt-4 font-semibold text-gray-700">
                Skills: Social media management, content creation, graphic design
              </p>
              <Button className="mt-6" variant="outline">
                Apply Now →
              </Button>
            </div>
          </div>
          <div className="flex w-full items-center justify-center">
            <div className="relative h-full w-full">
              <Image
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop"
                width={500}
                height={500}
                alt="Marketing Intern"
                className="mx-24 flex h-[700px] w-[500px] flex-col items-center justify-center rounded-lg shadow-md object-cover"
              />
            </div>
          </div>
        </section>

        {/* Coach Roles Spotlight */}
        <section className="container mx-auto flex flex-col py-10 md:flex-row">
          <div className="flex flex-col gap-5 p-4 md:w-2/4 lg:w-3/4">
            <h2 className="mb-2 text-sm font-bold uppercase text-gray-500">
              COACH ROLES
            </h2>
            <div>
              <div className="flex flex-col gap-0">
                <h1 className="mb-1 text-4xl font-semibold">
                  Youth Program Coordinator Coach
                </h1>
                <p className="mb-4 text-sm text-gray-600">
                  Remote • Flexible hours • Ongoing
                </p>
              </div>
              <p className="mb-4 text-gray-700">
                "The greatest lesson ámaxa taught me is that no matter how new you are at something, you still have potential to make a positive impact."
              </p>
              <p className="mb-4 text-gray-700">
                Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
              <p className="mb-4 text-gray-700">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa quae ab illo inventore veritatis.
              </p>
              <p className="mt-4 font-semibold text-gray-700">
                Requirements: Experience in youth mentorship, project management skills
              </p>
              <Button className="mt-6" variant="outline">
                Learn More →
              </Button>
            </div>
          </div>
          <div className="flex w-full items-center justify-center">
            <div className="relative h-full w-full">
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
                width={500}
                height={500}
                alt="Coach Role"
                className="mx-24 flex h-[700px] w-[500px] flex-col items-center justify-center rounded-lg shadow-md object-cover"
              />
            </div>
          </div>
        </section>

        {/* Volunteer Spotlight */}
        <section className="container mx-auto flex flex-col py-10 md:flex-row">
          <div className="flex flex-col gap-5 p-4 md:w-2/4 lg:w-3/4">
            <h2 className="mb-2 text-sm font-bold uppercase text-gray-500">
              VOLUNTEER POSITIONS
            </h2>
            <div>
              <div className="flex flex-col gap-0">
                <h1 className="mb-1 text-4xl font-semibold">
                  Community Outreach Volunteer
                </h1>
                <p className="mb-4 text-sm text-gray-600">
                  Various locations • Flexible commitment
                </p>
              </div>
              <p className="mb-4 text-gray-700">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <p className="mb-4 text-gray-700">
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
              </p>
              <p className="mt-4 font-semibold text-gray-700">
                Impact: Help connect communities and spread awareness about our mission
              </p>
              <Button className="mt-6" variant="outline">
                Get Involved →
              </Button>
            </div>
          </div>
          <div className="flex w-full items-center justify-center">
            <div className="relative h-full w-full">
              <Image
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop"
                width={500}
                height={500}
                alt="Volunteer"
                className="mx-24 flex h-[700px] w-[500px] flex-col items-center justify-center rounded-lg shadow-md object-cover"
              />
            </div>
          </div>
        </section>

        {/* Paid Roles Coming Soon */}
        <section className="container mx-auto flex flex-col py-10 md:flex-row">
          <div className="flex flex-col gap-5 p-4 md:w-2/4 lg:w-3/4">
            <h2 className="mb-2 text-sm font-bold uppercase text-gray-500">
              PAID POSITIONS
            </h2>
            <div>
              <div className="flex flex-col gap-0">
                <h1 className="mb-1 text-4xl font-semibold">
                  Development Manager
                </h1>
                <p className="mb-4 text-sm text-gray-600">
                  Coming Soon • Full-time
                </p>
              </div>
              <p className="mb-4 text-gray-700">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
              <p className="mb-4 text-gray-700">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
              </p>
              <p className="mt-4 font-semibold text-gray-700">
                We're expanding our team with paid positions. Check back soon!
              </p>
              <Button className="mt-6" variant="outline" disabled>
                Coming Soon
              </Button>
            </div>
          </div>
          <div className="flex w-full items-center justify-center">
            <div className="relative h-full w-full">
              <div className="mx-24 flex h-[700px] w-[500px] flex-col items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                <DollarSign className="h-24 w-24" />
                <p className="mt-4 text-lg">Coming Soon</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-[#F5F2F2] py-16 md:py-24 lg:py-32">
          <div className="px-6 md:px-16 lg:px-20">
            <h2 className="mb-12 max-w-5xl text-3xl font-normal leading-tight text-[#3B3B3B] md:mb-16 md:text-4xl lg:text-5xl">
              More opportunities coming soon!
            </h2>
            <Button className="rounded-full border border-[#3B3B3B] bg-white px-6 py-3 hover:bg-gray-50">
              <span className="text-base font-normal text-[#3B3B3B] md:text-lg">
                Contact Us About Opportunities →
              </span>
            </Button>
          </div>
        </section>
      </section>
    </main>
  );
}
