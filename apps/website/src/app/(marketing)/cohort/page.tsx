import React from 'react'
const steps = [
  {
    title: "Apply to the next cohort.",
    description: "We offer cohorts for high school students, college students, and professionals.",
    color: "bg-[#F4FFD6]",
  },
  {
    title: "Attend an interview.",
    description:
      "Tell us more about your interests, time availability, and projects or initiatives you're most interested in.",
    color: "bg-[#C8D998]",
  },
  {
    title: "We match you to a project, team, and coach!",
    description:
      "We aim to match you to a project you are passionate about with a team that meets in a time that you indicated works for you consistently.",
    color: "bg-[#BCD96C]",
  },
  {
    title: "Meet remotely with your team weekly for 3 months.",
    description:
      "Meetings last about one hour each week. Your coach will guide you in the project management methodologies designed specifically for our cohorts. Each meeting, coaches will lead you in planning, brainstorming, status checks, problem solving, and more.",
    color: "bg-[#94AB55]",
  },
]
export default function Page() {

  return (
    <div className='flex flex-col h-screen'>
      <section className="relative justify-center h-[865px] bg-[#F5F2F2] flex flex-col items-end p-[73px_67px] gap-[68px]">
        {/* Frame 58 */}
        <div className="flex flex-row items-start gap-[74px] w-[1136px] h-[215px]">
          <h2 className="w-[349px] h-[120px] font-normal text-[48px] leading-[60px] text-black">
            What are cohorts?
          </h2>
          <p className="w-[711px] h-[215px] font-normal text-[32px] leading-[40px] text-[#3B3B3B]">
            Through our 3-month remote program, you work in a remote team of your peers,
            guided by a coach, to effect measurable change through one of our 10 partner
            nonprofits or ámaxa original initiatives.
          </p>
        </div>

        {/* Frame 59 */}
        <div className="flex flex-row items-center gap-[97px] w-[1136px] h-[80px]">
          <h2 className="w-[326px] h-[60px] font-normal text-[48px] leading-[60px] text-black">
            Who can join?
          </h2>
          <p className="w-[711px] h-[80px] font-normal text-[32px] leading-[40px] text-[#3B3B3B]">
            High school students, college students, and anyone beyond!
          </p>
        </div>

        {/* Frame 60 */}
        <div className="flex flex-row items-center gap-[99px] w-[1136px] h-[60px]">
          <h2 className="w-[326px] h-[60px] font-normal text-[48px] leading-[60px] text-black">
            Is it remote?
          </h2>
          <p className="w-[711px] h-[48px] font-normal text-[32px] leading-[40px] text-[#3B3B3B]">
            Cohorts are 100% remote.
          </p>
        </div>

        {/* Frame 61 */}
        <div className="flex flex-row items-start gap-[74px] w-[1136px] h-[160px]">
          <h2 className="w-[349px] h-[60px] font-normal text-[48px] leading-[60px] text-black">
            Is there a cost?
          </h2>
          <p className="w-[711px] h-[160px] font-normal text-[32px] leading-[40px] text-[#3B3B3B]">
            Members pay an annual fee of $150. We provide full and partial scholarships to
            anyone in-need. After we receive funding, we hope to lower or remove this fee
            altogether.
          </p>
        </div>
      </section>
      <section className="  px-4 py-16 bg-[#F5F2F2]">
        <div className='max-w-7xl mx-auto'>
          <h2 className="text-[60px] leading-[78px] text-[#3B3B3B] font-normal mb-16">How Cohorts Work</h2>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-4 top-6 bottom-6 w-px bg-black" />

            {/* Steps */}
            <div className="space-y-16">
              {steps.map((step, index) => (
                <div key={index} className="relative pl-16">
                  {/* Circle Marker */}
                  <div className={`absolute left-0 top-3 w-8 h-8 border border-black rounded-full ${step.color}`} />

                  {/* Content */}
                  <div>
                    <h3 className="text-3xl leading-[60px] text-black mb-4 font-normal">{step.title}</h3>
                    <p className="text-[32px] leading-10 text-[#3B3B3B] max-w-4xl">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div >
  )
}

