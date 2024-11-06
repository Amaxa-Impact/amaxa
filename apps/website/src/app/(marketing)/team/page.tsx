"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { Card, CardContent } from "@amaxa/ui/card";

interface TeamMember {
  name: string;
  role: string;
  quote: string;
  bio: string;
  photo: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Lauren McMillen",
    role: "Founder and CEO",
    quote: "",
    bio: "Lauren, a New York University Abu Dhabi graduate in Computer Science and Arabic, is now pursuing a Master's in Middle Eastern Studies at the University of Edinburgh. With a strong foundation in technology and experience in over a dozen non-profits, she's driven by a powerful mission: empowering others to recognize their potential to make a real difference in the world.",
    photo: "/lauren-headshot.png",
  },
  {
    name: "Lexi Jones",
    role: "Head of Programs and Marketing",
    quote:
      "The world is a crazy place right now. I love that Amaxa empowers students and young professionals to face it head on, and to come up with creative, innovative and energetic solutions to the problems we are facing. Getting to be a part of the Amaxa team is a chance for me to tell students, young adults and dreamers what I wish I'd been told: 'Your ideas matter and you can make a difference; now let's get started.",
    bio: "I was born and raised in central Illinois: think corn fields as far as you can see and Friday night lights... I'm currently pursuing a degree in International Studies and a minor in Political Science at the University of Tampa. I've interned at CHANGE Illinois and United Way Suncoast, volunteered on the Polish-Ukrainian border, and am part of the leadership team at North America for Ukraine. I am passionate about creativity and art (in all its forms), and how we can use those things to make an impact in our world. My roles as Director of Marketing and Head of Programs at Amaxa allow me to explore just that, whether it be creating new programs, designing pitch decks and content, or building brand identity. In my spare time you'll catch me out for a walk or run (with music or a podcast on, of course), reading, or in the midst of shenanigans with my nearest and dearest.",
    photo: "/lex-headshot.jpg",
  },
  {
    name: "Aniketh Chenjeri",
    role: "Chief Technological Officer",
    quote: "",
    bio: "Ani drives the development of the ámaxa platform, tackling key challenges and creating innovative software solutions. A junior in high school, he has invested thousands of hours in programming and problem-solving. His skills have earned national recognition, with multiple state and national titles in programming and cybersecurity.",
    photo: "/placeholder.svg?height=400&width=400",
  },
  {
    name: "Pari Singh",
    role: "Director of Operations",
    quote: "",
    bio: "Pari is a skilled Scrum Master and Project Manager, known for co-ordinating teams to deliver impactful results. As Senior Advisor for the bhangra team, she raised over $1000 for cancer research through her Greek life organization. With strong management, leadership, and determination, Pari is ready to lead ámaxa to success.",
    photo: "/placeholder.svg?height=400&width=400",
  },
  {
    name: "Heather Miller",
    role: "Director of Digital Marketing",
    quote: "",
    bio: "Heather oversees our $10,000 Google Ads grant, designs landing pages, and writes compelling blog posts. With a Marketing degree and digital marketing certificate from BYU-Idaho, she brings years of experience as a Google Ads Specialist at Hangar Marketing, managing campaigns for diverse clients. Her expertise in Google Ads, combined with her strong content creation skills and in-depth keyword research, ensures both effective ad management and engaging, impactful content.",
    photo: "/placeholder.svg?height=400&width=400",
  },
  {
    name: "Phoebe Cox",
    role: "Head of Research and Strategy",
    quote: "",
    bio: "Phoebe leverages her psychology background to drive market and user research, bringing valuable insights from her experience in refugee aid, fundraising, research, and copywriting. As co-founder of Bike4Bast, she raised £12,000 for recovery programs and is deeply committed to Amaxa's mission, inspired by her charity work in China and her passion for helping others.",
    photo: "/placeholder.svg?height=400&width=400",
  },
];

function TeamMemberCard({
  member,
  index,
}: {
  member: TeamMember;
  index: number;
}) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.8, 1, 1, 0.8],
  );
  const x = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100]);

  return (
    <motion.div ref={cardRef} style={{ opacity, scale, x }} className="mb-16">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3">
              <img
                src={member.photo}
                alt={member.name}
                className="h-64 w-full object-cover md:h-full"
              />
            </div>
            <div className="p-6 md:w-2/3">
              <h2 className="mb-2 text-2xl font-semibold">{member.name}</h2>
              <h3 className="mb-4 text-xl text-muted-foreground">
                {member.role}
              </h3>
              <p className="mb-4 text-sm italic text-muted-foreground">
                "{member.quote}"
              </p>
              <p className="text-sm text-muted-foreground">{member.bio}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function MeetTheTeam() {
  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center text-4xl font-bold"
      >
        Meet Our Team
      </motion.h1>
      <div className="mx-auto max-w-4xl">
        {teamMembers.map((member, index) => (
          <TeamMemberCard key={member.name} member={member} index={index} />
        ))}
      </div>
    </div>
  );
}
