export interface SpotlightData {
  heading: string;
  name: string;
  ageLocation: string;
  paragraphs: string[];
  teammates: string;
  videoUrl: string;
}

export interface HomePageData {
  id: string;
  headerTitle: string;
  headerBgFrom: string;
  headerBgTo: string;
  imageAlt: string;
  imageSrc: string;
  solutionTitle: string;
  solutionSubtitle: string;
  solutionParagraphs: string[];
  spotlightData: SpotlightData;
  spotlightData1?: SpotlightData;
}

export const projects: HomePageData[] = [


  //***ORIGINAL INITIATIVES***
  ///////////////////////////

  //MHFA
  {
    id: "mhfa",
    headerTitle:
      "Teens are lost every day to suicide. Friends and family need more knowledge to recognize symptoms & take action.",
    headerBgFrom: "#ffffff",
    headerBgTo: "#278CD4",
    imageAlt: "mental health banner",
    imageSrc:
      "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOEftqdP9NYGn17FfRk38wqIh5UP6LM9TadAmy",
    solutionTitle: "THE SOLUTION",
    solutionSubtitle:
      "Mental Health First Aid: Research, Expert Opinions, & Peer-to-Peer Education",
    solutionParagraphs: [
      "When you were young, if you fell down and scraped a knee, what would you do? Probably get a bandaid from wherever you keep your first aid supplies, right? Yet, most of us don’t know what ‘first aid’ means when it comes to mental health, despite the stakes being much higher.",
      "The first aspect of the MHFA project fills gaps in online resources. Ámaxa teams work to compile a comprehensive database of mental health resources at the country, state and local level. The goal is to have a comprehensive database where, no matter where you are located, you can find help, resources, and community.",
      "The second aspect of the MHFA project is building a mental health first aid course. Ámaxa teams conduct outreach and interviews with leaders in the field of youth mental health. Conversations with these researchers and educators will form the backbone of the mental health course we hope to develop and implement in schools worldwide. Our vision is to bring mental health education and practices into classrooms, clubs and more through peer to peer conversation, teaching and learning.",
    ],
    spotlightData: {
      heading: "MEMBER SPOTLIGHT",
      name: "Meet Saachi.",
      ageLocation: "16, USA",
      paragraphs: [
        "“It’s great to spread awareness, like mental health month, but also not everybody that spreads awareness understands the true underlying factors that go with mental health issues, how to recognize different symptoms. I really like how this project is conveying that spreading awareness is just not enough in order for people to truly understand mental illness.”",
        "Saachi led a workshop for 60 students and teachers at her school on a OneLove module about toxic relationships. To accomplish this, she got certified through the OneLove 18-hour intense training, successfully advertised her event at her school, and delivered the workshop and facilitated students’ journeys towards also getting certified.",
        "Saachi is continuing her work as an Ámaxa Student Ambassador to build a mental health first aid organization in her commuinty.",
      ],
      teammates: "Teammates: Katelyn (17, USA)",
      videoUrl: "", // optional if you don't have a video
    },
  },
  
  //GLOBAL FOREST
  {
    id: "global-forest",
    headerTitle:
      "Big corporations and governments are not doing enough to save our planet from climate change.",
    headerBgFrom: "#585858",
    headerBgTo: "#666666",
    imageAlt: "forest image",
    imageSrc:
      "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOmSb46sGZ8BkVU4SJgWfYiHpwKRujOh50EtyM",
    solutionTitle: "THE SOLUTION",
    solutionSubtitle:
      "Plant trees & track carbon sequestration with ámaxa’s Global Forest initiative.",
    solutionParagraphs: [
      `Trees sequester carbon dioxide. You probably know this. However, to
            fight the climate crisis, we need to know more. Each species of tree
            sequesters carbon dioxide relative to its size and structure. Some
            species are more effective at carbon capturing than others. By
            identifying which trees maximize carbon sequestration, we can help
            slow climate change`,
      `The ámaxa Global Forest project is multifaceted. As part of your
            ámaxa team, you raise funds to purchase seedlings or young trees,
            then plant them in local communities around the world. Once trees
            are planted, ámaxa teams measure the carbon sequestration of each
            tree. This data helps us learn which trees are most beneficial to
            the climate.`,`
            Once enough data is gathered, we’ll share our findings and continue
            to grow the project strategically. Our goal is to create visual,
            data-backed resources that highlight a simple message: when you
            nurture the Earth, it provides.`,],
    spotlightData: {
      heading: "Member Spotlight",
      name: "Meet An Nhi.",
      ageLocation: "16, Vietnam",
      paragraphs: [`Her team planted three trees native to their communities in the US, Vietnam, and Turkey.  They completed measurements on the tree, and started the process of calculating the CO2 sequestration.`,
        `Guided by their coach, they implemented the project management techniques ámaxa developed based on 2 years of research and project iterations.`,`By meeting remotely every week for 3 months, they raised the funds to purchase the seedlings for each tree. Then, they identified a suitable place to plant it. Finally, they measured the tree and calculated the CO2 each sequesters.`],
      teammates: "Teammates: Mohamed (17, Turkey) & Lauryn (16, USA)",
      videoUrl: "https://youtube.com/embed/1mNWMKv2xPU?si=7bEp8vcsKRu33eHQ",
    },
  },

  
  

  //KARINA'S LIBRARY
  {
    id: "karinas-library",
    headerTitle:
      "Book bans and censorship threaten the lives of women and girls in the US and beyond.",
    headerBgFrom: "#585858",
    headerBgTo: "#7A26D6",
    imageAlt: "karina miszori",
    imageSrc:
      "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOSbTnpOwdQt18rFgVynhG5ljvz0eRmMCYuOWw",
    solutionTitle: "THE SOLUTION",
    solutionSubtitle:
      "Karina’s Library: Empowering Minds, Inspiring Equality",
    solutionParagraphs: [
      "Feminism tends to mean different things to different people. For our late Chief Partnerships Officer, Karina Miszori, it represented a calling. Karina ardently believed in, and fought for, a world in which equality was the norm and women were educated, empowered, and equal in every facet of life. This project is in honor of Karina, and the world she envisioned.",
      "Karina’s Library is centered on representation and education and is one of ámaxa’s newest projects. ámaxa teams will begin by researching and creating a reading list to work with. The reading list will be comprehensive. For younger children, the goal is simply to find books that feature multifaceted girls in positions of empowerment, while also pushing back against some of the damaging narratives that girls are all too often introduced to at a young age. For example, Gertrude McFuzz by Dr. Seuss follows a bird who wishes she could look “more beautiful” by having more feathers. As the story progresses, she realizes that having more feathers infringes on some of her previous abilities and her interactions with others. It’s a great story to start dispelling negative beauty standards for younger readers. For older readers, the list may delve into works that are not only narratives, but also social commentary. The Handmaid’s Tale by Margaret Atwood is a well-known example that would be on this portion of the list.",
"After the list has been created, edited, and finalized, ámaxa teams will engage in book collection. Teams may fundraise in order to purchase the books, organize book drives, or even venture out to thrift stores and libraries in their communities to find pre-loved books that can be reused for the project. Once the ámaxa feminist library is large enough in size, we will open up a signup form on the ámaxa website. There schools can sign up to receive a book box, with a curated selection of books for their school library.",
"Ultimately, our goal is to empower students with knowledge. Reading not only fosters learning and understanding of the world but also broadens horizons, introducing diverse cultures, perspectives, and ideas. If the books we donate to schools inspire even one young girl to recognize her potential and see herself as the protagonist of her own story, then Karina’s Library will have achieved its purpose.",    ],
    spotlightData: {
      heading: "",
      name: "In Honor of Karina Miszori",
      ageLocation: "",
      paragraphs: [
       "For those of us on the ámaxa team, we knew Karina as a beacon of light and passion. She was a force of nature in her commitment to our mission, as well as to her passion for feminism and womens’ rights, neurodivergence research, and LGBTQ+ rights. Karina joined ámaxa as a Blog Writer intern in 2022, but it quickly became clear that we needed her contagious passion on our leadership team. She then laid the foundations of our social media strategy - a huge project that was a top priority. In 2023, she transitioned to Chief Partnerships Officer, opening crucial doors for us by forging partnerships with NYUAD group Violet Ventures, education consultancies, and more. In addition to her amazing work on our team, Karina founded the Gender Studies Minor at NYUAD. Because of her dedication to gender issues, thousands of students will be empowered to deepen and refine their passion for feminism, womens’ rights, and LGBTQ+ rights.",
      ],
      teammates: "",
      videoUrl: "",
    },
  },

  //LGBTQ+ IN THE ARTS
  {
    id: "lgbtq",
    headerTitle:
      "LGBTQ+ artists and queer stories are underrepresented and underfunded.",
    headerBgFrom: "#585858",
    headerBgTo: "#7A26D6",
    imageAlt: "lgbtq",
    imageSrc:
      "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOMuUN3gYQ8a9AhxfoFrcKlOZUmsICGX3Sqk0V",
    solutionTitle: "THE SOLUTION",
    solutionSubtitle:
      "The LGBTQ+ Artists Program: Promoting Voices, Empowering Creative Equality",
    solutionParagraphs: [
      "Representation and equality of opportunity is a constant struggle for the arts and entertainment industries. We are seeing more LGBTQ+ stories told than ever before, and the industry has continued to crack its gates open more widely for LGBTQ+ artists, but there is still much work to be done. Anyone in the art and entertainment industry will tell you that getting funding is hard. However, getting funding for, let’s say, a gay miniseries, or a trans romantic novel, is even harder. Studios, publishing houses, and execs still see these stories as ‘risky.’ Furthermore, LGBTQ+ artists themselves can have a harder time getting their foot, and therefore their art, inside the door. Without funding, everything else becomes harder too, including PR and marketing.",
      "Over the last few years, we have seen more students than ever coming to us with interests in PR and marketing. This program is a way for ámaxa to help LGBTQ+ artists and storytellers get the attention they deserve, while also allowing us to give our students tangible experience in their fields of interests. Through the application (which will be posted on our website prior to each cycle) LGBTQ+ artists and storytellers can apply to be our next feature artist. If selected, they will benefit from the help of our team of young professionals and marketing and PR students. From social media management and content creation, to pitch decks, to garnering publicity, the ámaxa team will work in alignment with the artist to promote and empower.",
      "Think of it as ámaxa’s own in-house PR and marketing agency; an agency where no story and no artist is too risky, and where all are encouraged to be and create with full authenticity. This is our homage to the arts: film, tv, paintings, music, novels, poetry, graphic design, animation, painting, sculpture and more. All art, and all artists, should be given equal opportunities to exist, create, and work – that’s what this project stands for. ",
    ],
    spotlightData: {
      heading: "PROJECT STORY",
      name: "Hear from COO Lexi on why she founded this project.",
      ageLocation: "",
      paragraphs: [
        "I am living proof that diverse storytelling and storytellers matter. So often, we fear, and discriminate and hate out of lack of understanding and lack of exposure. In the divisive climate we exist in today, art is one of the best ways for all of us to look beyond our own hometowns, beliefs, cultures, and personal stories and absorb what may be different, new or foreign to us. Along the way, art also tends to show us that we are all connected, and that hope and frustration, joy and anger, longing, and most of all, love, are universal. The best art makes us feel deeply, and at times makes us see the world around us differently – I know that’s certainly what it has done for me.",
        "I believe in the power of art, and I also believe that that power cannot be unleashed fully until we reach an equality of opportunity in the arts and entertainment industry. This project is my love letter to the arts, and my small way of moving towards a world where every story and every creator gets a chance.",
      ],
      teammates: "",
      videoUrl: "",
    },
  },

  ///***PARTNER NONPROFITS***
  ///////////////////////////

  ///EDUCHILDREN
  {
    id: "educhildren",
    headerTitle:
     "Students in Liberia don’t go to school if they cannot pay $80 for one year’s tuition.",
    headerBgFrom: "#585858",
    headerBgTo: "#7A26D6",
    imageAlt: "educhildren",
    imageSrc:
      "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOMuUN3gYQ8a9AhxfoFrcKlOZUmsICGX3Sqk0V",
    solutionTitle: "THE SOLUTION",
    solutionSubtitle:
      "Unlocking potential: sponsoring Liberian students' education",
    solutionParagraphs: 
    ["In Liberia, education is not something to be taken for granted. The long-lasting effects of a 14-year civil war, compounded by the 2014 school closure due to the Ebola outbreak, had a huge impact on the education system.” Many schools were damaged or destroyed, and many teachers fled the country or changed careers. As a result, many schools closed, and many of the schools that stayed open are concentrated in urban areas. Now take all of those damaging factors, and add in cost. According to Insights Liberia, “Poverty is a major barrier to education in Liberia. Many children are unable to attend school due to the costs associated with uniforms, books, and other supplies.",
      "Enter Educate Children. Educate Children works to improve access to and quality of education for primary-age children in Liberia’s slum communities. They develop programs to increase enrollment, enhance quality of instruction, and improve learning outcomes in primary schools. ámaxa teams work to raise funds to pay tuition costs for Liberian students within Educate Children’s communities of focus. One year of tuition is only $80, and we don’t want financial costs to be the reason any child does not receive an education.",
      "Thus far, ámaxa teams have worked hard to help Educate Children further their mission. One team sponsored 7 students’ full tuition by organizing a bike race to raise funds. Other groups have contributed to digital marketing efforts by creating content and working on a newsletter. All ámaxa students that work with Educate Children come away from the experience with not only transferable skills, (marketing, content creation, teamwork, organization, event planning, etc.) but also a greater knowledge of the world around them, and an enhanced understanding of education issues around the globe.",
    ],
    spotlightData: {
      heading: "PARTNER SPOTLIGHT",
      name: "Meet Educhildren.",
      ageLocation: "MONROVIA, LIBERIA",
      paragraphs: [
        "Our partner Educhildren, founded by Monrovia native Sekou Jabateh, employs a community-based approach to ensuring students have the funds to attend school.",
        "Enrollment Through Local Philanthropy (ETLP) is their primary program. It aims to increase primary school enrollment through local philanthropy within Liberia. Through a system of Volunteers Operation, we identify primary-age children (5-11years) in specific slum communities who are not enrolled in school, or have dropped out of school. We conduct assessment studies to identify cases where this is due to economic constraints.  Educate Children then identifies sponsors who support these children through school, and pair them with the children. Sponsors range from local donors to philanthropists, humanitarians, well-meaning individuals as well as corporate social responsibilities. Our pairing system emphasizes constant interaction between sponsors and their beneficiaries, allowing sponsors to track the progress of the children they are supporting in school.",
      ],
      teammates: "",
      videoUrl: "",
    },
  },

  //GAZA
  {
    id: "gaza",
    headerTitle:
      "Gazan children are dying of starvation in the ongoing genocide.",
    headerBgFrom: "#000000", // Black
    headerBgTo: "#006C35", // Green from Palestinian flag
    imageAlt: "Gaza humanitarian aid banner",
    imageSrc:
      "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOa56HTxIBDGmcbISEzQYZx81iL0rWJ43h2T9d", // Using the same image as ISNAD for now
    solutionTitle: "THE SOLUTION",
    solutionSubtitle:
      "Feeding Gaza: support for families during the ongoing genocide",
    solutionParagraphs: [
      "ámaxa members on the Gaza project team are urgently raising funds to support families trapped in Gaza amidst the ongoing humanitarian crisis. For the Summer 2024 cohort, the team focused on raising money. The funds will go to two families we connected with through our partner: Gaza Champions. These funds are crucial for providing immediate essentials, such as food, to prevent starvation and meet basic needs. Once borders open again, funds can go towards paying the $5000 fee to Egypt required to flee across the border.",
      "This initiative represents one of Ámaxa's most critical and urgent efforts, and is unique in its directness and ability to make a difference quickly. This direct and personal approach ensures that the aid reaches those in desperate need without the delays that can occur due to bureaucracy or politics. The situation in Gaza is dire, with many families struggling to access basic necessities due to severe restrictions and ongoing conflict. By contributing to this project, students can provide direct relief and support to those facing unimaginable hardships.",
      "At ámaxa, we believe in the power of direct action and the importance of community-driven support. The Gaza fundraising project is not just about providing financial assistance; it's about standing in solidarity with those who are suffering and using our resources to make a tangible impact. This project embodies our commitment to humanitarian aid and our belief that everyone deserves access to basic necessities, especially in times of crisis. By supporting these families, we are not only addressing immediate needs but also affirming our dedication to human dignity and compassion."
    ],
    spotlightData: {
      heading: "TEAM SPOTLIGHT",
      name: "Meet Isabella and Zobia.",
      ageLocation: "16 & 17, USA",
      paragraphs: [
        "\"Change, in any capacity, can and should start with us.\" -Isabella",
        `
Through ámaxa’s student impact fellowship, and a partnership with the nonprofit Gaza Champions, Isabella, Zobia, and their program coach Delilah created Alliance Academy’s first “Melody of Alliance Fall Charity Concert”. After being told that the brainstormed event could happen in just two weeks, the team jumped into action. They had spent the few weeks prior getting an idea of their timeline based on their before-winter-break goal and now they’d met a crunch point where all tasks were vital to make the concert the best it could be. Isabella and Zobia worked together in and outside of the weekly meetings arranged by their coach to contact sponsors for the event’s raffle, create awesome marketing material, and make sure everything was approved by school authority. At the event, they had 20 attendants, 3 raffle prizes awarded, and almost $200 USD raised. The team reflected that they believe that they did an awesome job with the limited job they were given. A huge takeaway was to focus on what you are in control of.
`
      ],
      teammates: "",
      videoUrl: ""
    }
  },

  //ISNAD
  {
    id: "isnad",
    headerTitle:
      "Palestinian students in the West Bank cannot access diverse educational opportunities due to the Israeli occupation.",
    headerBgFrom: "#CE1126", // inspired by the red in the Palestinian flag
    headerBgTo: "#006C35", // inspired by green from the Palestinian flag
    imageAlt: "Palestinian education banner",
    imageSrc: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOBGXc3oMfgbteu1vLlWOMACT9miBqyShdJ8jc",
    solutionTitle: "THE SOLUTION",
    solutionSubtitle:
      "Expanding learning and community: Opening the Window for Palestinian students",
    solutionParagraphs: [
      "Although ámaxa has been working with ISNAD from its very first cohort, we strongly believe that the partnership is more important today than ever. Due to the Israeli occupation, most Palestinians can’t travel outside of Palestine. This, in conjunction with the war currently going on, has made many Palestinian students feel more isolated than ever. It has also made consistent, high-quality education a struggle, as the unpredictability of war affects every aspect of students’ lives.",
      "Ámaxa teams work with ISNAD Community Education Center to connect Palestinian students with other students from around the globe. These connections not only help Palestinian students feel a bit less isolated, but also help ámaxa students get a clearer understanding of what Palestinians are going through, and the gravity of the situation there. Students in the past have helped teach English, increased the community center’s presence on social media, and worked to create Accesifyed: an interactive website to host custom English lessons for Palestinian students.",
      "Entering 2025, however, ámaxa teams will address the ISNAD community’s most pressing need: food insecurity. Due to Israeli checkpoints enforced even more harshly as the Gaza genocide rages on, families in the West Bank cannot work, leaving many without income to buy food. ISNAD is currently raising funds to support grassroots agricultural projects that enable Palestinians to eat.",
    ],
    spotlightData: {
      heading: "TEAM SPOTLIGHT",
      name: "Meet ISNAD",
      ageLocation: "DAHRIA, WEST BANK, PALESTINE",
      paragraphs: [
        "The ISNAD Community Education Center works to fill educational gaps in Dahria, a town south of Hebron in the West Bank. The center is the first of its kind in the area to combine in-class and community-based learning to promote both learning and community development using a variety of formal and informal approaches. The center aims at strengthening the educational capabilities and skills of students of different age categories through a variety of specialized training courses in fields like languages, social media, planning, and arts. It also aims to enhance youth engagement in their communities through organizing voluntary initiatives and interventions in different localities.",
        "However, due to the Israeli crackdown in the West Bank during the ongoing war in Gaza, ISNAD has had to halt all education programming. They are now working to enable Palestinians to grow their own food in order to survive, as Israeli checkpoints and violence have kept families from working, unable to earn income to feed their families. Support their efforts today.",
      ],
      teammates: "",
      videoUrl: "",
    },
    // spotlightData: {
    //   heading: "TEAM SPOTLIGHT",
    //   name: "Meet Panshul, Jad, and Yueqi",
    //   ageLocation: "UAE, LEBANON, & CHINA",
    //   paragraphs: [
    //     `“Since almost all students in Palestine have access to the Web, we aim to create an interactive, educational website where students can find pre-recorded lessons by tutors who will be recruited by our team.” Driven by their combined passions for education and technology, Zhao (16, China), Jad (16, Lebanon), Noor (16, Qatar), and Panshul (14, UAE), led by coach Sibel, created Accessifyed, which now offers 16 math lessons and 10 English lessons with tutoring`,
    //     `Panshul, Jad, and Zhao are now Ámaxa Student Ambassadors. The ámaxa leadership team will provide 1-1 coaching and guidance to expand Accessifyed from an MVP to a scaled solution for all of ISNAD’s students.`,
    //     `“My team members proved to be some of the most ambitious people with a strong wish to make a change. They approached the project wholeheartedly and wanted to put in the work to make something that would stay an important part of online, accessible education.” -Sibel, Team Coach`
    //   ],
    //   teammates: "",
    //   videoUrl: "",
    // },
  },

  ///NYAKA
  {
    id: "nyaka",
    headerTitle:
      "Women and the children they support in southwestern Uganda cannot work or do homework after the sun sets.",
    headerBgFrom: "#585858",
    headerBgTo: "#7A26D6",
    imageAlt: "solar lights in Uganda",
    imageSrc:
      "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOMuUN3gYQ8a9AhxfoFrcKlOZUmsICGX3Sqk0V",
    solutionTitle: "THE SOLUTION",
    solutionSubtitle:
      "Giving Light: Solar Lights for Grandmothers in Nyaka, Uganda",
    solutionParagraphs: [
      "The HIV/AIDS crisis has left thousands of children orphaned in southwestern Uganda. Grandmothers are the pillars of the community, taking care of not only their own grandchildren but other children orphaned as well. Yet, after dusk (before 7 pm due to Uganda’s location on the Equator), income-generating activities like weaving and students’ ability to do homework becomes impossible.",
      "With our partner Nyaka Global, Ámaxa teams fundraise and conduct outreach to provide solar powered lights to grandmothers in Nyaka, which provide free electricity to them and the children they support. This initiative truly shows how social issues are oftentimes intricately interwoven with one another.",
    ],
    spotlightData: {
      heading: "PARTNER SPOTLIGHT",
      name: "Meet Nyaka Global.",
      ageLocation: "NYAKAGYEZI, UGANDA",
      paragraphs: [
        "Our partner Nyaka Global provides community-based solutions to address the needs of orphaned and vulnerable children in rural southwestern Uganda. Founded in 2003 by Jackson Kaguri, who grew up in the village, Nyaka has built two primary schools, a secondary school, and a vocational school which provides education, uniforms, supplies, and meals, completely free for all its students.",
        "More than building schools, however, Nyaka built a library, a clinic, and founded a program for grandmothers to earn income through weaving and more. Visit them at their website to learn more.",
      ],
      teammates: "",
      videoUrl: "https://www.youtube.com/embed/70DQMda5USs",
    },
  },

///UKRAINIAN ACTION
  {
    id: "ukraine",
    headerTitle:
      "Ukrainians enduring bombing and occupation need urgent medical supplies.",
    headerBgFrom: "#0057B7", // Blue (inspired by the Ukrainian flag)
    headerBgTo: "#FFD700", // Yellow (inspired by the Ukrainian flag)
    imageAlt: "Ukrainian medical aid banner",
    imageSrc:
      "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOMQ3852YQ8a9AhxfoFrcKlOZUmsICGX3Sqk0V",
    solutionTitle: "THE SOLUTION",
    solutionSubtitle:
      "Frontline Support: Providing Urgent Medical Aid to Ukrainians Caught in the Crossfire",
    solutionParagraphs: [
      "It’s often said that in war, civilians suffer the most. This truth has clearly shown itself in Ukraine. Since Russia's unjust full-scale invasion in 2022 and the war that has followed, civilians have not only had to worry about shelling and invading forces, but also about food and medicine shortages. This is especially true for those living near the frontlines. Although many Ukrainians have relocated, or fled the country as refugees, some have not been able to leave. For example, many elderly Ukrainians have opted to stay in their homes, as moving is simply not an option for them due to age.",
      "Ámaxa teams raise funds for urgent medical and humanitarian supplies needed by Ukrainian civilians with our partner Ukrainian Action. Teams help with digital fundraising and marketing campaigns, while also fundraising in their communities. Although we are acutely aware that we cannot replace all that has been lost, our goal is to do everything we can to provide dignity and the best quality of life possible for Ukrainians caught in the crosshairs of war.",
    ],
    spotlightData: {
      heading: "PARTNER SPOTLIGHT",
      name: "Meet Ukrainian Action.",
      ageLocation: "US & UK",
      paragraphs: [
        "Ukrainian Action is a volunteer-run, US nonprofit and UK charity that is dedicated to supporting Ukraine. They regularly drive and donate vehicles filled with humanitarian and medical supplies to the country, and support local reconstruction and healthcare projects.",
      ],
      teammates: "",
      videoUrl: "",
    },
  },

  
  

  
  
];
