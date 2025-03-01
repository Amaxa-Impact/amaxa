import Footer from "~/components/footer";
import { Projects } from "./_sections/projects";

export default function Page() {
  return (
    <main>
      <section className="relative w-full bg-[#F5F2F2] flex flex-col py-16 md:py-24">
        {/* Background graphics */}

        {/* Content */}
        <div className="relative z-10 px-6 md:px-16 lg:px-20">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-black mb-8 md:mb-16">
            Welcome to ámaxa.
          </h1>

          <h2 className="text-xl md:text-2xl font-normal leading-tight text-[#3B3B3B] mb-4 md:mb-10">
            THE PROBLEM
          </h2>

          <p className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight text-black max-w-4xl mb-8 md:mb-10">
            It's too hard for people who want to make a difference to actually
            do it.
          </p>

          <h2 className="text-xl md:text-2xl font-normal leading-tight text-[#3B3B3B] mb-4 md:mb-10">
            WHY DOES IT MATTER?
          </h2>

          <p className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight text-black max-w-4xl">
            People facing poverty, conflict, health challenges, and more could
            be
            <span className="font-bold"> profoundly impacted </span>
            if more of us knew how to turn our passion into meaningful change.
          </p>
        </div>
      </section>

      <section className="relative py-16 md:py-24 bg-white">
        <div className="px-6 md:px-16 lg:px-20">
          {/* Main heading */}
          <h1 className="font-semibold text-3xl md:text-4xl lg:text-5xl leading-tight text-black mb-12 md:mb-16">
            The Ámaxa Cohort Program takes you from start to finish of what's
            needed to truly effect change.
          </h1>

          {/* Description text */}
          <div className="max-w-5xl font-normal text-xl md:text-2xl leading-relaxed text-[#3B3B3B] mb-12 md:mb-16">
            <p className="mb-10">
              Through our 3-month 100% remote program, you meet weekly with a
              team from across the globe, guided by an ámaxa coach, to effect
              measurable change through one of our 10 partner nonprofits or
              initiatives.
            </p>
            <p>
              The program is open to{" "}
              <span className="font-semibold">
                high school students, college students, and professionals.
              </span>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-10">
            {/* High school button */}
            <button className="box-border flex justify-center items-center py-3 px-6 bg-[#BCD96C] border border-black rounded-full">
              <span className="font-normal text-base md:text-lg text-[#3B3B3B]">
                I'm a high school student →
              </span>
            </button>

            {/* College button */}
            <button className="box-border flex justify-center items-center py-3 px-6 bg-[#3B3B3B] border border-black rounded-full">
              <span className="font-normal text-base md:text-lg text-white">
                I'm in college or beyond →
              </span>
            </button>
          </div>
        </div>
      </section>
      <section className="relative w-full p-16 md:p-24">
        <Projects />
      </section>

      <section className="py-16 md:py-24 bg-[#F5F2F2] flex flex-col justify-center items-start px-6 md:px-16 lg:px-20">
        <div className="relative mb-8 w-full">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-[#3B3B3B] leading-tight">
            ámaxa (άμαξα): Greek for vehicle
          </h2>
          <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2">
            <svg
              width="200"
              height="40"
              viewBox="0 0 200 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-32 md:w-48 lg:w-56"
            >
              <path
                d="M1 20C1 20 40 5 60 20C80 35 120 5 140 20C160 35 199 20 199 20"
                stroke="#BCD96C"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-[#3B3B3B] leading-tight max-w-5xl">
          We aim to be a{" "}
          <span className="font-semibold">vehicle for impact</span> for
          thousands of people globally.
        </h2>
      </section>

      <section className="py-16 md:py-24 lg:py-32 bg-[#F5F2F2]">
        <div className="px-6 md:px-16 lg:px-20">
          {/* Main heading */}
          <h2 className="font-normal text-3xl md:text-4xl lg:text-5xl leading-tight text-[#3B3B3B] mb-12 md:mb-16 max-w-5xl">
            We want to build a world where anyone who wants to help the world
            can do it.
          </h2>

          {/* Button */}
          <button className="box-border flex justify-center items-center py-3 px-6 bg-white border border-[#3B3B3B] rounded-full">
            <span className="font-normal text-base md:text-lg text-[#3B3B3B]">
              Support Our Vision →
            </span>
          </button>
        </div>
      </section>
      <Footer />
    </main>
  );
}
