import React from "react";
import Link from "next/link";

import { ProfileCard } from "./_components/people";
import { FocusCards } from "@/components/ui/focus-cards-many";
import { ApplyButton } from "~/components/apply";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@amaxa/ui/tabs";


export const cards = [
  {
    title: "Created Accessifyed educational platform for the ISNAD Center in Palestine",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOQI4SoEOsmkEelahd1WSuvzRG6jICN9HqcOF3",
    link: "",
    description: "",
  },
  {
    title: "Planted trees across Turkey, US, and the UAE",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOVscvGzWL0MYRHUetxwcyzJn3h7alsSdIDAKf",
    link: "",
    description: "",
  },
  {
    title: "Raised $700 for Gazans through student concert in USA and basketball tournament in Qatar",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToO1yec3BZuh38756znQ1WsobkyBqTCiLE0ramM",
    link: "",
    description: "",
  },
  {
    title: "Paid full year tuition for 7 students in Liberia through martial arts tournament and bake sale",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOaVg3qCIBDGmcbISEzQYZx81iL0rWJ43h2T9d",
    link: "",
    description: "",
  },
  {
    title: "Raised $500 for medical supplies for Ukrainian civilians",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOaVg3qCIBDGmcbISEzQYZx81iL0rWJ43h2T9d",
    link: "",
    description: "",
  },
  {
    title: "Launched Student Ambassador group for cohort students who showed exceptional committment and passion",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOVscvGzWL0MYRHUetxwcyzJn3h7alsSdIDAKf",
    link: "",
    description: "",
  },
  {
    title: "Launched our first in-person pathway, the Colorado Ámaxa network",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOaVg3qCIBDGmcbISEzQYZx81iL0rWJ43h2T9d",
    link: "",
    description: "",
  },
  {
    title: "Ongoing: providing artist Piera van de Wiel with a trained PR team to promote her documentary on LGBTQ+ refugees",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToO1yec3BZuh38756znQ1WsobkyBqTCiLE0ramM",
    link: "",
    description: "",
  },


 
];

export default function WhoAreWePage() {
  return (
    <main>
      <div className="relative flex max-h-[320px] w-full flex-col bg-white px-6 sm:max-h-[240px] md:max-h-[320px] md:px-12 lg:px-20">
        {/* Background container - hidden but preserved for reference */}
        <div className="invisible absolute inset-0">
          <div
            className="h-full w-full"
            style={{ background: "url(/Untitled design.png)" }}
          />
        </div>
        {/* Content container with flex layout */}
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-6 md:px-16 lg:px-20">
            <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
              <div className="mb-12 max-w-full md:mb-0 md:max-w-3xl lg:max-w-4xl">
                <h1 className="text-3xl font-light leading-tight text-[#3B3B3B] md:text-4xl lg:text-6xl">
                  Meet ámaxa: {" "}
                  <span className="font-normal text-[#3B3B3B]">
                  Mission & Team
                  </span> 
                </h1>

                {/* Green wavy line - SVG replacement for the image */}
                <div className="lg:w-200 relative -mt-2 ml-auto h-6 w-48 md:-mt-4 md:w-64">
                  <svg
                    viewBox="0 0 325 500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className=""
                  >
                    <path
                      d="M1 41C1 41 54 10 81 41C108 72 162 10 189 41C216 72 270 41 270 41"
                      stroke="#BCD96C"
                      strokeWidth="8"
                    />
                    strokeLinecap="round"
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
         <section className="container mx-auto flex flex-col">
              <div className="flex flex-col gap-10 py-10 text-[#3B3B3B]">
                <section className="w-full px-6 md:px-16 lg:px-20">
                  <div className="mx-auto max-w-7xl">
                    <div className="space-y-16 md:space-y-24">
                      <div>
                        <h3 className="mb-4 text-2xl font-normal text-[#3B3B3B] md:text-3xl">
                          Our vision is a world where anyone who wants to make a
                          difference can do it.
                        </h3>
                        <p className="mb-6 max-w-3xl text-lg">
                   
              For the first time in history, we can see in crystal clear detail
              the challenges faced by others across the world. Also for the
              first time in history, we can change that person's life across the
              world easier than ever before.
       
              But, it's not quite that easy. Who do you help? What's the best
              way to help? How do I raise the money or spread the word? How do I
              find others who want to do it with me?
       
              We want to build a world where anyone who wants to make a
              difference can do it. That's why we set out to build the only
              place where we take you from start to finish of what's needed to
              truly effect change.
        
                        </p>  
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </section>

            <section className="container mx-auto flex flex-col">
              <div className="flex flex-col gap-10 py-10 text-[#3B3B3B]">
                <section className="w-full px-6 md:px-16 lg:px-20">
                  <div className="mx-auto max-w-7xl">
                    <div className="space-y-16 md:space-y-24">
                      <div>
                        <h2 className="mb-4 text-2xl font-normal text-[#3B3B3B] md:text-3xl">
                          To accomplish this, we take our members from start to finish of what's needed to
              truly effect change. 
                        </h2>
                        <p className="mb-6 max-w-3xl text-lg">
                   
                        We provide end-to-end support for every step needed to actually effect change, while alternatives often focus on just one. We match you with a high-impact nonprofit or ámaxa initiative, connect you to a team, and provide a coach to guide you with 1-1 support. We train you in proven project management methods and build features in our web app to solve the problems, however minute, you identify. You drive the impact, and we ensure the tools and support are in place to make it happen. 
                        </p>  
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </section>


            <section className="container mx-auto flex flex-col">
              <div className="flex flex-col gap-10 py-10 text-[#3B3B3B]">
                <section className="w-full px-6 md:px-16 lg:px-20">
                  <div className="mx-auto max-w-7xl">
                    <div className="space-y-16 md:space-y-24">
                      <div>
                        <h2 className="mb-4 text-2xl font-normal text-[#3B3B3B] md:text-3xl">
Here's (some) of we've done, all while operating as a volunteer-led organization:                        
</h2>
                      <FocusCards cards={cards} />

                       
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </section>




            <section className="container mx-auto flex flex-col">
              <div className="flex flex-col gap-10 py-10 text-[#3B3B3B]">
                <section className="w-full px-6 md:px-16 lg:px-20">
                  <div className="mx-auto max-w-7xl">
                    <div className="space-y-16 md:space-y-24">
                      <div>
                        <h2 className="mb-4 text-2xl font-normal text-[#3B3B3B] md:text-3xl">
                        Our work is vital because it democratizes social impact, empowering individuals of any background or location to become active agents of change. 
                        </h2>
                        <p className="mb-6 max-w-3xl text-lg">
                   
                       Over 240 students have applied to our Cohort Program from 48 countries and counting. Fundamental to our mission is that our $150 program fee for the high school Cohorts pathway is accessible, with scholarships available for any student in need, closing the extracurricular gap for low-income students. Upon securing funding, we aim to get rid of the program fee entirely.

        
                        </p>  
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </section>


            <section className="container mx-auto flex flex-col">
              <div className="flex flex-col gap-10 py-10 text-[#3B3B3B]">
                <section className="w-full px-6 md:px-16 lg:px-20">
                  <div className="mx-auto max-w-7xl">
                    <div className="space-y-16 md:space-y-24">
                      <div>
                        <h2 className="mb-4 text-2xl font-normal text-[#3B3B3B] md:text-3xl">
                Supporting teen mental health is also an innate part of our mission.
                        </h2>
                        <p className="mb-6 max-w-3xl text-lg">
                        According to new research, such as this article in Scientific American, teens who help others experience reductions in depression and anxiety. One of the most <a className="underline" href="https://www.scientificamerican.com/article/teens-mental-health-may-improve-when-they-help-others/">striking findings</a>, for example, is that, in one study, after 30 hours of volunteer work, de­pressive symptoms [for teens aged 14-20] reduced an average of 19%. Our high school Cohort program averages 50 hours over the 3 month period and offers the opportunity to contribute to meaningful causes while connecting with peers and mentors globally which in turn fosters self-esteem and emotional well-being.
        
                        </p>  
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </section>











            <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-6 md:px-16 lg:px-20">
            <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
              <div className="mb-12 max-w-full md:mb-0 md:max-w-3xl lg:max-w-4xl">
                <h1 className="text-3xl font-light leading-tight text-[#3B3B3B] md:text-4xl lg:text-6xl">
                  Meet the team {" "}
                  {/* <span className="font-normal text-[#3B3B3B]">
                  Mission & Team
                  </span>  */}
                </h1>

                {/* Green wavy line - SVG replacement for the image */}
                <div className="lg:w-200 relative -mt-2 ml-auto h-6 w-48 md:-mt-4 md:w-64">
                  <svg
                    viewBox="0 0 325 500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className=""
                  >
                    <path
                      d="M1 41C1 41 54 10 81 41C108 72 162 10 189 41C216 72 270 41 270 41"
                      stroke="#BCD96C"
                      strokeWidth="8"
                    />
                    strokeLinecap="round"
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>




      <section className="w-full">
        
        {[
          {
            name: "Lauren McMillen",
            title: "Founder & CEO",
            bio: `Lauren, a New York University Abu Dhabi graduate in Computer Science and Arabic, is now pursuing a Master's in Middle Eastern Studies at the University of Edinburgh. With a strong foundation in technology and experience in over a dozen non-profits, she's driven by a powerful mission: empowering others to recognize their potential to make a real difference in the world.`,
            imageUrl:
              "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOTtH94SrPvV4ygRa57DXtJwU9SfhC1qxONmlA",
          },
          {
            name: "Alexi Jones",
            title: "COO",
            bio: `
"The world is a crazy place right now. I love that Amaxa empowers students and young professionals to face it head on, and to come up with creative, innovative and energetic solutions to the problems we are facing. Getting to be a part of the Amaxa team is a chance for me to tell students, young adults and dreamers what I wish I'd been told: 'Your ideas matter and you can make a difference; now let's get started."
Lexi grew up in central Illinois, where cornfields stretch to the horizon and Friday nights are for football. Currently, she is pursuing a degree in International Studies with a Political Science minor at the University of Tampa. Lexi's journey includes internships at CHANGE Illinois and United Way Suncoast, volunteering on the Polish-Ukrainian border, and contributing to the North America for Ukraine leadership team.
`,
            imageUrl:
              "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOeKcidoyvrS3NH5LD0fGBOXwFydpiVbYzJMa1",
          },
          {
            name: "Aniketh Chenjeri",
            title: "CTO",
            bio: `
Ani drives the development of the ámaxa platform, tackling key challenges and creating innovative software solutions. A junior in high school, he has invested thousands of hours in programming and problem-solving. His skills have earned national recognition, with multiple state and national titles in programming and cybersecurity.
            `,
            imageUrl:
              "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOYnvGR8lUs9XMErKJv7Faw8TpfmyuG5lVHhqx",
          },
        ].map((person, idx) => (
          <ProfileCard
            key={idx}
            name={person.name}
            title={person.title}
            bio={person.bio}
            imageUrl={person.imageUrl}
          />
        ))}
      </section>
      <section className="relative w-full bg-[#F5F2F2] px-6 py-16 md:px-12 md:py-24 lg:px-20 lg:py-32">
        <div className="flex flex-col">
          {/* Main heading - large text */}
          <h2 className="mb-16 max-w-[90%] text-[36px] font-normal leading-tight text-[#3B3B3B] md:mb-24 md:max-w-[1074px] md:text-[48px] md:leading-[78px] lg:mb-32 lg:text-[60px]">
            We want to build a world where anyone who wants to help the world
            can do it.
          </h2>

          {/* Button with border */}
          <div className="mt-auto">
            <Link
              href="/support"
              className="inline-flex items-center justify-center rounded-full border border-[#3B3B3B] bg-white px-7 py-3 text-[18px] text-[#3B3B3B] transition-colors hover:bg-gray-50 md:text-[20px]"
            >
              Support Our Vision →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
