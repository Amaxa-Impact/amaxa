"use client";

import { ProjectContentShell } from "../../_components/project-content/ProjectContentShell";

export default function Page() {
  return (
    <ProjectContentShell
      images={["/forest.png"]}
      content={[
        "Excess carbon dioxide is fueling the climate crisis. Trees sequester carbon dioxide. You probably know this. However, to fight the climate crisis, we need to know more. Each species of tree sequesters carbon dioxide relative to its size and structure. In other words, some species of trees are more effective at carbon capturing than others. By doing the work to learn which trees maximize carbon sequestration, we can help slow down the climate change crisis.",
        "The ámaxa Global Forest project is multifaceted. Students raise funds to purchase seedlings/young trees. They then plant them in their local communities – this makes our forest truly global: we have trees in Vietnam, California, the UAE and Turkey! Once trees are planted, ámaxa teams measure the carbon sequestration of the trees they plant. This allows us to learn more about which trees are most helpful to the climate. ",
        "Once enough data is gathered, we plan to disperse our information to the public, and use it to continue strategically planting our forest. Our goal is to create impactful visual, and databacked resources that show a simple, but important message: When you tend to, give back to, and nurture the Earth, it will provide.",
      ]}
    />
  );
}
