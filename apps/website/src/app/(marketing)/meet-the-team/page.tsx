import React from "react";

const TeamPage = () => {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-16 lg:px-20">
        <h2 className="mb-4 max-w-5xl text-3xl font-normal text-[#3B3B3B] md:text-4xl lg:text-5xl">
          Meet the Leadership
        </h2>
        <p className="mb-12 max-w-3xl text-lg text-neutral-600">
          The passionate people behind Àmaxa, working to make social impact
          accessible to everyone.
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Team Member 1 */}
          <div className="group relative overflow-hidden rounded-3xl bg-[#F5F2F2] transition-all hover:shadow-2xl">
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500"
                alt="Sarah Johnson"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-6">
              <div className="mb-2 inline-block rounded-full bg-[#7A9B7E] px-3 py-1 text-xs font-medium text-white">
                Leadership
              </div>
              <h3 className="mb-1 text-xl font-semibold text-[#3B3B3B]">
                Sarah Johnson
              </h3>
              <p className="mb-3 text-sm font-medium text-neutral-600">
                Founder & CEO
              </p>
              <p className="text-sm leading-relaxed text-neutral-500">
                Leading Àmaxa's mission to democratize social impact and empower
                changemakers globally.
              </p>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="group relative overflow-hidden rounded-3xl bg-[#F5F2F2] transition-all hover:shadow-2xl">
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500"
                alt="Michael Chen"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-6">
              <div className="mb-2 inline-block rounded-full bg-[#8AAE8E] px-3 py-1 text-xs font-medium text-white">
                Programs
              </div>
              <h3 className="mb-1 text-xl font-semibold text-[#3B3B3B]">
                Michael Chen
              </h3>
              <p className="mb-3 text-sm font-medium text-neutral-600">
                Program Director
              </p>
              <p className="text-sm leading-relaxed text-neutral-500">
                Designing transformative programs that connect students with
                meaningful impact opportunities.
              </p>
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="group relative overflow-hidden rounded-3xl bg-[#F5F2F2] transition-all hover:shadow-2xl">
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500"
                alt="Elena Rodriguez"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-6">
              <div className="mb-2 inline-block rounded-full bg-[#6B8E70] px-3 py-1 text-xs font-medium text-white">
                Research
              </div>
              <h3 className="mb-1 text-xl font-semibold text-[#3B3B3B]">
                Elena Rodriguez
              </h3>
              <p className="mb-3 text-sm font-medium text-neutral-600">
                Head of Research
              </p>
              <p className="text-sm leading-relaxed text-neutral-500">
                Leading innovative research initiatives that drive real-world
                impact for communities.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-16 lg:px-20">
        <h2 className="mb-4 max-w-5xl text-3xl font-normal text-[#3B3B3B] md:text-4xl lg:text-5xl">
          Meet the team
        </h2>
        <p className="mb-12 max-w-3xl text-lg text-neutral-600">
          The passionate people behind Àmaxa, working to make social impact
          accessible to everyone.
        </p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Team Member Card 1 */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100 p-6 transition-all hover:shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="h-20 w-20 overflow-hidden rounded-full bg-gradient-to-br from-purple-400 to-pink-400">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200"
                  alt="Team member"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-neutral-500">
                  Founder & CEO
                </div>
              </div>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-[#3B3B3B]">
              Sarah Johnson
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-neutral-600">
              Passionate about democratizing social impact and empowering the
              next generation of changemakers.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="text-neutral-400 transition-colors hover:text-[#3B3B3B]"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-neutral-400 transition-colors hover:text-[#3B3B3B]"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Team Member Card 2 */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100 p-6 transition-all hover:shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="h-20 w-20 overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-cyan-400">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
                  alt="Team member"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-neutral-500">
                  Program Director
                </div>
              </div>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-[#3B3B3B]">
              Michael Chen
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-neutral-600">
              Dedicated to building meaningful partnerships and creating
              transformative experiences for students worldwide.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="text-neutral-400 transition-colors hover:text-[#3B3B3B]"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-neutral-400 transition-colors hover:text-[#3B3B3B]"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Team Member Card 3 */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100 p-6 transition-all hover:shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="h-20 w-20 overflow-hidden rounded-full bg-gradient-to-br from-orange-400 to-rose-400">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200"
                  alt="Team member"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-neutral-500">
                  Head of Research
                </div>
              </div>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-[#3B3B3B]">
              Elena Rodriguez
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-neutral-600">
              Leading innovative research initiatives that drive real-world
              impact for communities around the globe.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="text-neutral-400 transition-colors hover:text-[#3B3B3B]"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-neutral-400 transition-colors hover:text-[#3B3B3B]"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-16 lg:px-20">
        <h2 className="mb-4 max-w-5xl text-3xl font-normal text-[#3B3B3B] md:text-4xl lg:text-5xl">
          Meet the Coaches
        </h2>
        <p className="mb-12 max-w-3xl text-lg text-neutral-600">
          The passionate people behind Àmaxa, working to make social impact
          accessible to everyone.
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Team Member 1 */}
          <div className="group relative overflow-hidden rounded-3xl bg-[#F5F2F2] transition-all hover:shadow-2xl">
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500"
                alt="Sarah Johnson"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-6">
              <div className="mb-2 inline-block rounded-full bg-[#7A9B7E] px-3 py-1 text-xs font-medium text-white">
                Leadership
              </div>
              <h3 className="mb-1 text-xl font-semibold text-[#3B3B3B]">
                Sarah Johnson
              </h3>
              <p className="mb-3 text-sm font-medium text-neutral-600">
                Founder & CEO
              </p>
              <p className="text-sm leading-relaxed text-neutral-500">
                Leading Àmaxa's mission to democratize social impact and empower
                changemakers globally.
              </p>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="group relative overflow-hidden rounded-3xl bg-[#F5F2F2] transition-all hover:shadow-2xl">
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500"
                alt="Michael Chen"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-6">
              <div className="mb-2 inline-block rounded-full bg-[#8AAE8E] px-3 py-1 text-xs font-medium text-white">
                Programs
              </div>
              <h3 className="mb-1 text-xl font-semibold text-[#3B3B3B]">
                Michael Chen
              </h3>
              <p className="mb-3 text-sm font-medium text-neutral-600">
                Program Director
              </p>
              <p className="text-sm leading-relaxed text-neutral-500">
                Designing transformative programs that connect students with
                meaningful impact opportunities.
              </p>
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="group relative overflow-hidden rounded-3xl bg-[#F5F2F2] transition-all hover:shadow-2xl">
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500"
                alt="Elena Rodriguez"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-6">
              <div className="mb-2 inline-block rounded-full bg-[#6B8E70] px-3 py-1 text-xs font-medium text-white">
                Research
              </div>
              <h3 className="mb-1 text-xl font-semibold text-[#3B3B3B]">
                Elena Rodriguez
              </h3>
              <p className="mb-3 text-sm font-medium text-neutral-600">
                Head of Research
              </p>
              <p className="text-sm leading-relaxed text-neutral-500">
                Leading innovative research initiatives that drive real-world
                impact for communities.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamPage;
