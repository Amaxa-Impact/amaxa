import React from "react";

export default function ProgramPage() {
  return (
    <main>
      <section className="w-full bg-white py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-16 lg:px-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="max-w-full md:max-w-3xl lg:max-w-4xl mb-12 md:mb-0">
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-light leading-tight text-[#3B3B3B]">
                Effect change from anywhere with{" "}
                <span className="font-normal text-[#3B3B3B]">
                  Ámaxa Cohorts
                </span>
              </h1>

              {/* Green wavy line - SVG replacement for the image */}
              <div className="relative h-6 w-48 md:w-64 lg:w-80 ml-auto -mt-2 md:-mt-4">
                <svg
                  viewBox="0 0 325 82"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
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

            <div className="mt-8 md:mt-16 lg:mt-24 self-end md:self-center">
              <a
                href="#apply"
                className="inline-flex items-center text-2xl md:text-3xl lg:text-5xl font-normal text-black hover:underline"
              >
                Apply now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full bg-[#F5F2F2] py-16 md:py-20 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-12 md:space-y-16 lg:space-y-20">
            {/* What are cohorts? */}
            <div className="flex flex-col md:flex-row md:gap-8 lg:gap-16">
              <div className="mb-4 md:mb-0 md:w-1/3">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-black">
                  What are cohorts?
                </h2>
              </div>
              <div className="md:w-2/3">
                <p className="text-xl md:text-2xl lg:text-3xl font-normal text-[#3B3B3B] leading-snug">
                  Through our 3-month remote program, you work in a remote team
                  of your peers, guided by a coach, to effect measurable change
                  through one of our 10 partner nonprofits or ámaxa original
                  initiatives.
                </p>
              </div>
            </div>

            {/* Who can join? */}
            <div className="flex flex-col md:flex-row md:gap-8 lg:gap-16">
              <div className="mb-4 md:mb-0 md:w-1/3">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-black">
                  Who can join?
                </h2>
              </div>
              <div className="md:w-2/3">
                <p className="text-xl md:text-2xl lg:text-3xl font-normal text-[#3B3B3B] leading-snug">
                  High school students, college students, and anyone beyond!
                </p>
              </div>
            </div>

            {/* Is it remote? */}
            <div className="flex flex-col md:flex-row md:gap-8 lg:gap-16">
              <div className="mb-4 md:mb-0 md:w-1/3">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-black">
                  Is it remote?
                </h2>
              </div>
              <div className="md:w-2/3">
                <p className="text-xl md:text-2xl lg:text-3xl font-normal text-[#3B3B3B] leading-snug">
                  Cohorts are 100% remote.
                </p>
              </div>
            </div>

            {/* Is there a cost? */}
            <div className="flex flex-col md:flex-row md:gap-8 lg:gap-16">
              <div className="mb-4 md:mb-0 md:w-1/3">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-black">
                  Is there a cost?
                </h2>
              </div>
              <div className="md:w-2/3">
                <p className="text-xl md:text-2xl lg:text-3xl font-normal text-[#3B3B3B] leading-snug">
                  Members pay an annual fee of $150. We provide full and partial
                  scholarships to anyone in-need. After we receive funding, we
                  hope to lower or remove this fee altogether.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-16 lg:py-20 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto space-y-16 md:space-y-20">
          {/* High School Program */}
          <div className="space-y-8 md:space-y-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-[#3B3B3B]">
              Ámaxa High School
            </h2>

            <p className="text-lg md:text-xl lg:text-2xl font-normal text-[#3B3B3B] leading-relaxed">
              We believe high school students are capable of effecting change at
              a large scale. Our high school cohorts match you to a team of
              students from ages 14-18 from across the world, guided by a
              trained undergraduate coach. More than 180 students have applied
              from 48 countries and counting.
            </p>

            <div>
              <a
                href="#apply-high-school"
                className="inline-flex items-center justify-center px-7 py-3 bg-[#BCD96C] border border-black rounded-full text-base md:text-lg text-[#3B3B3B] hover:bg-[#a9c55a] transition-colors"
              >
                Apply to Ámaxa High School →
              </a>
            </div>
          </div>

          {/* College & Professionals Program */}
          <div className="space-y-8 md:space-y-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-[#3B3B3B]">
              Ámaxa College & Professionals
            </h2>

            <p className="text-lg md:text-xl lg:text-2xl font-normal text-[#3B3B3B] leading-relaxed">
              We believe our model of effecting change through remote project
              meetings with peers and a coach, aided by fine-tuned project
              management methodologies and custom-built online tools, allows
              anyone to effect change. Apply to our 2025 cohort today.
            </p>

            <div>
              <a
                href="#apply-college"
                className="inline-flex items-center justify-center px-7 py-3 bg-[#3B3B3B] border border-black rounded-full text-base md:text-lg text-white hover:bg-[#2a2a2a] transition-colors"
              >
                Apply to Ámaxa College & Professionals →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#F5F2F2] py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-[#3B3B3B] mb-12 md:mb-16">
            How Cohorts Work
          </h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-black"></div>

            {/* Timeline steps */}
            <div className="space-y-16 md:space-y-20">
              {/* Step 1 */}
              <div className="relative pl-16 md:pl-20">
                {/* Circle */}
                <div className="absolute left-0 top-3 w-8 h-8 rounded-full bg-[#F4FFD6] border border-black flex items-center justify-center">
                  <span className="sr-only">Step 1</span>
                </div>

                <h3 className="text-xl md:text-2xl lg:text-3xl font-normal text-black mb-4">
                  Apply to the next cohort.
                </h3>

                <p className="text-lg md:text-xl lg:text-2xl font-normal text-[#3B3B3B] leading-relaxed">
                  We offer cohorts for high school students, college students,
                  and professionals.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative pl-16 md:pl-20">
                {/* Circle */}
                <div className="absolute left-0 top-3 w-8 h-8 rounded-full bg-[#C8D998] border border-black flex items-center justify-center">
                  <span className="sr-only">Step 2</span>
                </div>

                <h3 className="text-xl md:text-2xl lg:text-3xl font-normal text-black mb-4">
                  Attend an interview.
                </h3>

                <p className="text-lg md:text-xl lg:text-2xl font-normal text-[#3B3B3B] leading-relaxed">
                  Tell us more about your interests, time availability, and
                  projects or initiatives you're most interested in.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative pl-16 md:pl-20">
                {/* Circle */}
                <div className="absolute left-0 top-3 w-8 h-8 rounded-full bg-[#BCD96C] border border-black flex items-center justify-center">
                  <span className="sr-only">Step 3</span>
                </div>

                <h3 className="text-xl md:text-2xl lg:text-3xl font-normal text-black mb-4">
                  We match you to a project, team, and coach!
                </h3>

                <p className="text-lg md:text-xl lg:text-2xl font-normal text-[#3B3B3B] leading-relaxed">
                  We aim to match you to a project you are passionate about with
                  a team that meets in a time that you indicated works for you
                  consistently.
                </p>
              </div>

              {/* Step 4 */}
              <div className="relative pl-16 md:pl-20">
                {/* Circle */}
                <div className="absolute left-0 top-3 w-8 h-8 rounded-full bg-[#94AB55] border border-black flex items-center justify-center">
                  <span className="sr-only">Step 4</span>
                </div>

                <h3 className="text-xl md:text-2xl lg:text-3xl font-normal text-black mb-4">
                  Meet remotely with your team{" "}
                  <span className="font-semibold">weekly</span> for{" "}
                  <span className="font-semibold">3 months</span>.
                </h3>

                <p className="text-lg md:text-xl lg:text-2xl font-normal text-[#3B3B3B] leading-relaxed">
                  Meetings last about one hour each week. Your coach will guide
                  you in the project management methodologies designed
                  specifically for our cohorts. Each meeting, coaches will lead
                  you in planning, brainstorming, status checks, problem
                  solving, and more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full bg-[#F5F2F2] py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-20">
          <div className="max-w-4xl lg:max-w-5xl mb-12 md:mb-16 lg:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal text-[#3B3B3B] leading-tight">
              Read stories of past members to learn about the diverse types of
              projects cohorts undertake.
            </h2>
          </div>

          <div>
            <a
              href="/project-stories"
              className="inline-flex items-center justify-center px-7 py-3 bg-white border border-[#3B3B3B] rounded-full text-base md:text-lg text-[#3B3B3B] hover:bg-gray-50 transition-colors"
            >
              Read project stories →
            </a>
          </div>
        </div>
      </section>
      <section className="w-full py-16 md:py-24 lg:py-32 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-black mb-6">
            What makes us different?
          </h2>

          <p className="text-lg md:text-xl mb-16 max-w-4xl">
            We take you from "I wish I could" to "Here's how I did." To
            accomplish this, we spent the last two years iterating, improving,
            and learning. Here's some things we do different than everyone else:
          </p>

          <div className="space-y-16 md:space-y-24">
            {/* Feature 1 */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 text-[#BCD96C]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-normal text-[#3B3B3B] mb-4">
                  We built an online platform designed to amplify the impact of
                  our teams.
                </h3>
                <p className="text-lg mb-6 max-w-3xl">
                  With each new cohort, we more precisely understand teams'
                  challenges, and over time, this data will fuel AI-driven
                  tools, giving each team lessons of all teams before them.
                </p>
                <a
                  href="/platform"
                  className="inline-flex items-center justify-center px-6 py-2 bg-[#BCD96C] rounded-full text-[#3B3B3B] hover:bg-[#a9c55a] transition-colors"
                >
                  Learn more about our platform →
                </a>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 text-[#BCD96C]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-normal text-[#3B3B3B] mb-4">
                  We are accessible across income and location.
                </h3>
                <p className="text-lg mb-6 max-w-3xl">
                  The ability to effect change should not be limited by your
                  home or your income. That's why we strive to make our
                  community accessible and inclusive, so everyone who wants to
                  make an impact can join. Our cohorts are 100% remote, and we
                  offer scholarships to anyone who is unable to pay our annual
                  $150 membership fee. After we receive funding, we aim to
                  remove the fee altogether.
                </p>
                <a
                  href="/mission"
                  className="inline-flex items-center justify-center px-6 py-2 bg-[#BCD96C] rounded-full text-[#3B3B3B] hover:bg-[#a9c55a] transition-colors"
                >
                  Read more about our mission →
                </a>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 text-[#BCD96C]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-normal text-[#3B3B3B] mb-4">
                  We are more than a 'program'. We are a community.
                </h3>
                <p className="text-lg mb-6 max-w-3xl">
                  Members leave a cohort with friends around the world. Whether
                  becoming close to your team members and coach, or meeting
                  others through our remote events, ámaxa aims to forge
                  connections that last well beyond the 3 month project.
                </p>
                <a
                  href="/stories"
                  className="inline-flex items-center justify-center px-6 py-2 bg-[#BCD96C] rounded-full text-[#3B3B3B] hover:bg-[#a9c55a] transition-colors"
                >
                  Read stories of our members →
                </a>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 text-[#BCD96C]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-normal text-[#3B3B3B] mb-4">
                  Our projects and initiatives are high-impact.
                </h3>
                <p className="text-lg mb-6 max-w-3xl">
                  Our projects are high-impact, innovative, and
                  community-driven. We have partnered with nonprofits in
                  Palestine, Liberia, and Uganda whose community-founded
                  solutions are innovative in their fields, such as ISNAD
                  Community Center's approach to community-based learning, the
                  first in its area, and the Nyaka School's holistic approach to
                  supporting AIDS-affected communities.
                </p>
                <p className="text-lg mb-6 max-w-3xl">
                  Where we spotted gaps in high-impact projects that our members
                  wanted to work on, we created our own. Led by Head of Programs
                  Alexi Jones, we have launched three new initiatives in 2024,
                  focusing on mental health, feminism, and LBGTQ+
                  representation.
                </p>
                <a
                  href="/projects"
                  className="inline-flex items-center justify-center px-6 py-2 bg-[#BCD96C] rounded-full text-[#3B3B3B] hover:bg-[#a9c55a] transition-colors"
                >
                  Explore All Projects →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
