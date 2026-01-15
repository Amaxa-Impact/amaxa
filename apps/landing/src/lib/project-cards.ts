/**
 * Project cards data for the homepage carousel
 *
 * This is a simplified version of the full projects data,
 * containing just what's needed for the carousel display.
 */

export const PROJECT_ISSUES = [
  "Accessible Education",
  "Humanitarian Aid",
  "Mental Health",
  "Women and Girls",
  "Platforming Diverse Voices",
  "Climate Change",
];

export interface ProjectCard {
  id: string;
  category: string;
  title: string;
  link: string;
  src: string;
  issues: string[];
}

export const projectCards: ProjectCard[] = [
  {
    category: "PARTNER: GAZA CHAMPIONS",
    id: "gaza",
    link: "/project/gaza",
    title: "Feeding Gaza: Support for Families in Crisis",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOVSuAZzWL0MYRHUetxwcyzJn3h7alsSdIDAKf",
    issues: ["Humanitarian Aid"],
  },
  {
    category: "PARTNER: NYAKA GLOBAL",
    id: "nyaka",
    title: "Giving Light: Solar Solutions for Ugandan Grandmothers",
    link: "/project/nyaka",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOXM5a2R0BrawSs24LUuYDb5IoTiA7Feh0fPKW",
    issues: ["Accessible Education", "Women and Girls"],
  },
  {
    category: "PARTNER: UKRAINIAN ACTION",
    title: "Frontline Support: Urgent Medical Aid to Ukrainians",
    id: "ukraine",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOFSqz9DhMgGqJpRmLFNh4KsQWVrkiIwAYnPaz",
    link: "/project/ukraine",
    issues: ["Humanitarian Aid"],
  },
  {
    category: "ÁMAXA ORIGINAL INITIATIVE",
    id: "karinas-library",
    title: "Karina's Library: Empowering Women, Fighting Censorship",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOkD4GobRePnYWC5xuvVyLTmQRSKBf6hsFkHJO",
    link: "/project/karinas-library",
    issues: ["Women and Girls"],
  },
  {
    category: "ÁMAXA ORIGINAL INITIATIVE",
    id: "global-forest",
    link: "/project/global-forest",
    title: "Ámaxa Global Forest: Planting Trees & Tracking Carbon",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOYEdEXWwlUs9XMErKJv7Faw8TpfmyuG5lVHhq",
    issues: ["Climate Change"],
  },
  {
    category: "PARTNER: ISNAD EDUCATION CENTER",
    id: "isnad",
    title: "Opening the Window for Palestinian Students",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOFHSjHghMgGqJpRmLFNh4KsQWVrkiIwAYnPaz",
    link: "/project/isnad",
    issues: ["Accessible Education", "Humanitarian Aid"],
  },
  {
    category: "ÁMAXA ORIGINAL INITIATIVE",
    id: "lgbtq",
    title: "LGBTQ+ Artists Program: Promoting Creative Equality",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToO8el17ogjXRpn0dgo1l6KOV2DuqGLya94cMIf",
    link: "/project/lgbtq",
    issues: ["Platforming Diverse Voices"],
  },
  {
    category: "ÁMAXA ORIGINAL INITIATIVE",
    title: "Mental Health First Aid: Peer-to-Peer Education",
    id: "mhfa",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOkX5KHvRePnYWC5xuvVyLTmQRSKBf6hsFkHJO",
    link: "/project/mhfa",
    issues: ["Mental Health"],
  },
  {
    category: "PARTNER: EDUCHILDREN",
    title: "Sponsoring Liberian Students' Education",
    id: "educhildren",
    src: "https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOaifCsCIBDGmcbISEzQYZx81iL0rWJ43h2T9d",
    link: "/project/educhildren",
    issues: ["Accessible Education"],
  },
];
