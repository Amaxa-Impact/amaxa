import type { ProjectCard } from "@/lib/project-cards";
import { useState } from "react";
import { FocusCards } from "@/components/custom-animations/focus-cards";
import { PROJECT_ISSUES } from "@/lib/project-cards";

import { Button } from "@amaxa/ui/button";

interface ProjectsFilterProps {
  cards: ProjectCard[];
}

export function ProjectsFilter({ cards }: ProjectsFilterProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const filteredCards = selected
    ? cards.filter((card) => card.issues.includes(selected))
    : cards;

  const handleClick = (issue: string) => {
    if (selected === issue) {
      setSelected(null);
    } else {
      setSelected(issue);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
   
      <div className="flex flex-wrap justify-center gap-3">
        {PROJECT_ISSUES.map((issue) => (
          <Button
            key={issue}
            onClick={() => handleClick(issue)}
            variant="outline"
            className={
              selected === issue
                ? "rounded-full bg-brand-green border-brand-green text-foreground hover:opacity-90"
                : "rounded-full hover:bg-brand-green hover:border-brand-green hover:text-foreground"
            }
          >
            {issue}
          </Button>
        ))}
      </div>

 
      {selected && (
        <Button variant="link" onClick={() => setSelected(null)}>
          Clear filter
        </Button>
      )}

      <FocusCards cards={filteredCards} />
    </div>
  );
}
