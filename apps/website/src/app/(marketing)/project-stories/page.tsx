"use client";

import React, { useEffect } from "react";

import { ApplyButton } from "~/components/apply";
import { Spotlight } from "../_sections/spotlight";

export default function ProgramPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://substack.com/embedjs/embed.js";
    script.async = true;
    script.charset = "utf-8";
    document.body.appendChild(script);
  }, []);

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
                <h1 className="text-4xl font-light leading-tight text-[#3B3B3B] md:text-4xl lg:text-6xl">
                  Ámaxa Stories{" "}
                  {/* <span className="font-normal text-[#3B3B3B]">
                  Meet Our Members
                </span> */}
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

      {[
        {
          heading: "Member Spotlight",
          name: "How An Nhi Sequestered Carbon by Planting Trees",
          ageLocation: "16, Vietnam",
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
          ageLocation: "16 & 17, USA",
          paragraphs: [
            '"Change, in any capacity, can and should start with us." -Isabella',
            `
Through ámaxa’s student impact fellowship, and a partnership with the nonprofit Gaza Champions, Isabella, Zobia, and their program coach Delilah created Alliance Academy’s first “Melody of Alliance Fall Charity Concert”. After being told that the brainstormed event could happen in just two weeks, the team jumped into action. They had spent the few weeks prior getting an idea of their timeline based on their before-winter-break goal and now they’d met a crunch point where all tasks were vital to make the concert the best it could be. Isabella and Zobia worked together in and outside of the weekly meetings arranged by their coach to contact sponsors for the event’s raffle, create awesome marketing material, and make sure everything was approved by school authority. At the event, they had 20 attendants, 3 raffle prizes awarded, and almost $200 USD raised. The team reflected that they believe that they did an awesome job with the limited job they were given. A huge takeaway was to focus on what you are in control of.
`,
          ],
          teammates: "",
          videoUrl:
            "https://player.vimeo.com/video/1069887902?h=acd24c8d11&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
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
        },
        {
          heading: "MEMBER SPOTLIGHT",
          name: 'How Maitha "opened the window" for Palestinian students to meet international students',
          ageLocation: "17, UAE",
          paragraphs: [
            `“Since almost all students in Palestine have access to the Web, we aim to create an interactive, educational website where students can find pre-recorded lessons by tutors who will be recruited by our team.” Driven by their combined passions for education and technology, Zhao (16, China), Jad (16, Lebanon), Noor (16, Qatar), and Panshul (14, UAE), led by coach Sibel, created Accessifyed, which now offers 16 math lessons and 10 English lessons with tutoring`,
            `Panshul, Jad, and Zhao are now Ámaxa Student Ambassadors. The ámaxa leadership team will provide 1-1 coaching and guidance to expand Accessifyed from an MVP to a scaled solution for all of ISNAD’s students.`,
            `“My team members proved to be some of the most ambitious people with a strong wish to make a change. They approached the project wholeheartedly and wanted to put in the work to make something that would stay an important part of online, accessible education.” -Sibel, Team Coach`,
          ],
          teammates: "",
          videoUrl: "",
        },
        {
          heading: "TEAM SPOTLIGHT",
          name: "How X Used Martial Arts and Cupcakes to Sponsor 7 Liberian students' full year tuition  ",
          ageLocation: "ROMANIA, USA",
          paragraphs: [
            `“Since almost all students in Palestine have access to the Web, we aim to create an interactive, educational website where students can find pre-recorded lessons by tutors who will be recruited by our team.” Driven by their combined passions for education and technology, Zhao (16, China), Jad (16, Lebanon), Noor (16, Qatar), and Panshul (14, UAE), led by coach Sibel, created Accessifyed, which now offers 16 math lessons and 10 English lessons with tutoring`,
            `Panshul, Jad, and Zhao are now Ámaxa Student Ambassadors. The ámaxa leadership team will provide 1-1 coaching and guidance to expand Accessifyed from an MVP to a scaled solution for all of ISNAD’s students.`,
            `“My team members proved to be some of the most ambitious people with a strong wish to make a change. They approached the project wholeheartedly and wanted to put in the work to make something that would stay an important part of online, accessible education.” -Sibel, Team Coach`,
          ],
          teammates: "",
          videoUrl: "",
        },
        {
          heading: "TEAM SPOTLIGHT",
          name: "How X organized a basketball tournament in Qatar to send crucial aid to Gazans",
          ageLocation: "ROMANIA, USA",
          paragraphs: [
            `“Since almost all students in Palestine have access to the Web, we aim to create an interactive, educational website where students can find pre-recorded lessons by tutors who will be recruited by our team.” Driven by their combined passions for education and technology, Zhao (16, China), Jad (16, Lebanon), Noor (16, Qatar), and Panshul (14, UAE), led by coach Sibel, created Accessifyed, which now offers 16 math lessons and 10 English lessons with tutoring`,
            `Panshul, Jad, and Zhao are now Ámaxa Student Ambassadors. The ámaxa leadership team will provide 1-1 coaching and guidance to expand Accessifyed from an MVP to a scaled solution for all of ISNAD’s students.`,
            `“My team members proved to be some of the most ambitious people with a strong wish to make a change. They approached the project wholeheartedly and wanted to put in the work to make something that would stay an important part of online, accessible education.” -Sibel, Team Coach`,
          ],
          teammates: "",
          videoUrl: "",
        },
        {
          heading: "TEAM SPOTLIGHT",
          name: "How X raised X money for Ukrainian Action",
          ageLocation: "RX",
          paragraphs: [
            `“Since almost all students in Palestine have access to the Web, we aim to create an interactive, educational website where students can find pre-recorded lessons by tutors who will be recruited by our team.” Driven by their combined passions for education and technology, Zhao (16, China), Jad (16, Lebanon), Noor (16, Qatar), and Panshul (14, UAE), led by coach Sibel, created Accessifyed, which now offers 16 math lessons and 10 English lessons with tutoring`,
            `Panshul, Jad, and Zhao are now Ámaxa Student Ambassadors. The ámaxa leadership team will provide 1-1 coaching and guidance to expand Accessifyed from an MVP to a scaled solution for all of ISNAD’s students.`,
            `“My team members proved to be some of the most ambitious people with a strong wish to make a change. They approached the project wholeheartedly and wanted to put in the work to make something that would stay an important part of online, accessible education.” -Sibel, Team Coach`,
          ],
          teammates: "",
          videoUrl: "",
        },
      ].map((spotlight, idx) => (
        <Spotlight key={idx} spotlightData={spotlight} />
      ))}
    </main>
  );
}
