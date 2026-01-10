"use client";

import React from "react";

import { AnimatedTitle } from "~/components/animated-underline";
import { Spotlight } from "../_sections/spotlight";

export default function ProgramPage() {
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
        <section className="mb-16 w-full overflow-visible py-16 md:mb-24 md:py-24">
          <div className="container mx-auto overflow-visible px-6 md:px-16 lg:px-20">
            <div className="flex flex-col items-center justify-center overflow-visible">
              <div className="mb-12 max-w-full overflow-visible">
                <AnimatedTitle underlinedText="Ámaxa Stories" color="#BCD96C" />
              </div>
            </div>
          </div>
        </section>
      </div>

      {[
        {
          heading: "Member Spotlight",
          name: "How An Nhi Sequestered Carbon by Planting Trees",
          ageLocation: "Vietnam",
          paragraphs: [
            `
Her team planted three trees native to their communities in the US, Vietnam, and Turkey.  They completed measurements on the tree, and started the process of calculating the CO2 sequestration.
`,
            `
Guided by their coach, they implemented the project management techniques ámaxa developed based on 2 years of research and project iterations. 
`,
            `
By meeting remotely every week for 3 months, they raised the funds to purchase the seedlings for each tree. Then, they identified a suitable place to plant it. Finally, they measured the tree and calculated the CO2 each sequesters.
`,
          ],
          teammates: "Teammates: Mohamed (17, Turkey) & Lauryn (16, USA)",
          videoUrl:
            "https://player.vimeo.com/video/1069899673?h=0ef231b81a&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
          imageUrl: "",
        },
        {
          heading: "TEAM SPOTLIGHT",
          name: "How Isabella and Zobia's Love for Music Changed Lives in Gaza",
          ageLocation: "USA",
          paragraphs: [
            '"Change, in any capacity, can and should start with us." -Isabella',
            `
Through ámaxa's student impact fellowship, and a partnership with the nonprofit Gaza Champions, Isabella, Zobia, and their program coach Delilah created Alliance Academy's first "Melody of Alliance Fall Charity Concert". After being told that the brainstormed event could happen in just two weeks, the team jumped into action. They had spent the few weeks prior getting an idea of their timeline based on their before-winter-break goal and now they'd met a crunch point where all tasks were vital to make the concert the best it could be. Isabella and Zobia worked together in and outside of the weekly meetings arranged by their coach to contact sponsors for the event's raffle, create awesome marketing material, and make sure everything was approved by school authority. At the event, they had 20 attendants, 3 raffle prizes awarded, and almost $200 USD raised. The team reflected that they believe that they did an awesome job with the limited job they were given. A huge takeaway was to focus on what you are in control of.
`,
          ],
          teammates: "",
          videoUrl:
            "https://player.vimeo.com/video/1069887902?h=acd24c8d11&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
          imageUrl: "",
        },
        {
          heading: "TEAM SPOTLIGHT",
          name: "How Panshul, Jad, and Yueqi founded a platform for educational accessibility",
          ageLocation: "UAE, LEBANON, & CHINA",
          paragraphs: [
            `“Since almost all students in Palestine have access to the Web, we aim to create an interactive, educational website where students can find pre-recorded lessons by tutors who will be recruited by our team.” Driven by their combined passions for education and technology, Zhao (16, China), Jad (16, Lebanon), Noor (16, Qatar), and Panshul (14, UAE), led by coach Sibel, created Accessifyed, which now offers 16 math lessons and 10 English lessons with tutoring`,
            `Panshul, Jad, and Zhao are now Ámaxa Student Ambassadors. The ámaxa leadership team will provide 1-1 coaching and guidance to expand Accessifyed from an MVP to a scaled solution for all of ISNAD’s students.`,
            `“My team members proved to be some of the most ambitious people with a strong wish to make a change. They approached the project wholeheartedly and wanted to put in the work to make something that would stay an important part of online, accessible education.” -Sibel, Team Coach`,
          ],
          teammates: "",
          videoUrl: "",
          imageUrl:
            "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOrTVqceQvsrdY6KUyulWLH1XBk7OqCf3F9gAQ",
        },
        {
          heading: "MEMBER SPOTLIGHT",
          name: "How Maitha Organized a Remote Cultural Exchange between Palestine & the UAE ",
          ageLocation: "UAE",
          paragraphs: [
            '"The greatest lesson ámaxa taught me is that no matter how new you are at something, you still have potential to make a positive impact."',
            "Maitha, living in Abu Dhabi in the United Arab Emirates, supported the ISNAD Community Education Center in two crucial ways. First, she created the foundations of its growing social media by setting up an Instagram page along with marketing guidelines and initial posts to help them get started.",
            "In addition, she created ISNAD's first cultural exchange. She organized a remote event with UAE and Palestinian students where they each discussed their cultures and educational experiences, both similarities and differences. ISNAD's founder emphasizes that, because of the severe restrictions of movement on Palestinians by Israel, it is a huge opportunity for Palestinian students to meet those from outside the country.",
          ],
          teammates: "",
          videoUrl: "",
          imageUrl: "",
        },
        // {
        //   heading: "TEAM SPOTLIGHT",
        //   name: "How X Used Martial Arts and Cupcakes to Sponsor 7 Liberian students' full year tuition  ",
        //   ageLocation: "ROMANIA, USA",
        //   paragraphs: [
        //     `“Since almost all students in Palestine have access to the Web, we aim to create an interactive, educational website where students can find pre-recorded lessons by tutors who will be recruited by our team.” Driven by their combined passions for education and technology, Zhao (16, China), Jad (16, Lebanon), Noor (16, Qatar), and Panshul (14, UAE), led by coach Sibel, created Accessifyed, which now offers 16 math lessons and 10 English lessons with tutoring`,
        //     `Panshul, Jad, and Zhao are now Ámaxa Student Ambassadors. The ámaxa leadership team will provide 1-1 coaching and guidance to expand Accessifyed from an MVP to a scaled solution for all of ISNAD’s students.`,
        //     `“My team members proved to be some of the most ambitious people with a strong wish to make a change. They approached the project wholeheartedly and wanted to put in the work to make something that would stay an important part of online, accessible education.” -Sibel, Team Coach`,
        //   ],
        //   teammates: "",
        //   videoUrl: "",
        // },
        {
          heading: "TEAM SPOTLIGHT",
          name: "How Damira and Aamna Launched Hoops4Hope in Qatar to Send Crucial Aid to Gazans",
          ageLocation: "Doha, Qatar",
          paragraphs: [
            "Damira and Aamna lead the Doha Youth Network, a student-led initiative dedicated to offering young people volunteering opportunities in Doha, Qatar. Through dedication and committment, and aided by their coach Sreeramya, Damira and Aamna organized a large-scale basketball tournament at their school.",
            "While they only had a short time to put it together, it was a success: they raised an amazing $700 sent directly to Gazans in dire need of aid. Their project exemplifies ámaxa's belief that any passion can be transformed into impact.",
          ],
          teammates: "",
          imageUrl:
            "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToON8mn5FDesbBzAkMUD2VgJC8t15PQoqpLNrjf",
          videoUrl: "",
        },
        // {
        //   heading: "TEAM SPOTLIGHT",
        //   name: "How X raised X money for Ukrainian Action",
        //   ageLocation: "RX",
        //   paragraphs: [
        //     `“Since almost all students in Palestine have access to the Web, we aim to create an interactive, educational website where students can find pre-recorded lessons by tutors who will be recruited by our team.” Driven by their combined passions for education and technology, Zhao (16, China), Jad (16, Lebanon), Noor (16, Qatar), and Panshul (14, UAE), led by coach Sibel, created Accessifyed, which now offers 16 math lessons and 10 English lessons with tutoring`,
        //     `Panshul, Jad, and Zhao are now Ámaxa Student Ambassadors. The ámaxa leadership team will provide 1-1 coaching and guidance to expand Accessifyed from an MVP to a scaled solution for all of ISNAD’s students.`,
        //     `“My team members proved to be some of the most ambitious people with a strong wish to make a change. They approached the project wholeheartedly and wanted to put in the work to make something that would stay an important part of online, accessible education.” -Sibel, Team Coach`,
        //   ],
        //   teammates: "",
        //   videoUrl: "",
        // },
      ].map((spotlight, idx) => (
        <Spotlight key={idx} spotlightData={spotlight} />
      ))}
      <section className="bg-[#F5F2F2] py-16 md:py-24 lg:py-32">
        <div className="px-6 md:px-16 lg:px-20">
          {/* Main heading */}
          <h2 className="mb-12 max-w-5xl text-3xl leading-tight font-normal text-[#3B3B3B] md:mb-16 md:text-4xl lg:text-5xl">
            More stories coming soon!
          </h2>

          {/* Button */}
          <button className="box-border flex items-center justify-center rounded-full border border-[#3B3B3B] bg-white px-6 py-3">
            <span className="text-base font-normal text-[#3B3B3B] md:text-lg">
              Support Our Vision →
            </span>
          </button>
        </div>
      </section>
    </main>
  );
}
