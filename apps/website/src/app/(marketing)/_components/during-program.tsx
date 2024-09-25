import TextReveal from "~/components/TextReveal";

export function AboutUsTextBlock() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center ">
      <TextReveal
        text="
      During the program, teams meet remotely once a week for 3-4 months.
      Meetings will look different for each team and stage of the project. In general, a meeting is about one hour long. Coaches lead in planning tasks, checking on statuses, giving feedback, brainstorming, learning about your issue more, using the amaxa online platform, meeting an invited speaker, or just getting to know each other.
      "
      />
      <TextReveal
        text="
      Our yearly membership fee is $150, allowing members to participate in four cohorts. We give scholarships to any student in need and aim to be a part of closing the extracurricular gap, ensuring low-income students have access to high-quality extracurricular programs. With sufficient funding, we hope to eliminate the high school student program fee altogether.
      We believe fervently that high school students can make a real impact. That's why our foundational program is for high school students. By 2025, we will expand our program to include college students and professionals, as well.
      "
      />
    </div>
  );
}
