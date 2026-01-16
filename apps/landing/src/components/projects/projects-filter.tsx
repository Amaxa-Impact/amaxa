import type { ProjectCard } from "@/lib/project-cards";
import { useMemo, useState } from "react";
import { FocusCards } from "@/components/custom-animations/focus-cards";
import { PROJECT_ISSUES } from "@/lib/project-cards";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@amaxa/ui/button";

interface ProjectsFilterProps {
  cards: ProjectCard[];
}

export function ProjectsFilter({ cards }: ProjectsFilterProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const filteredCards = useMemo(() => {
    return selected
      ? cards.filter((card) => card.issues.includes(selected))
      : cards;
  }, [selected, cards]);

  const handleClick = (issue: string) => {
    setSelected((prev) => (prev === issue ? null : issue));
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-wrap justify-center gap-3">
        {PROJECT_ISSUES.map((issue) => (
          <motion.div
            key={issue}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => handleClick(issue)}
              variant="outline"
              className={`rounded-full transition-all duration-300 ease-out ${
                selected === issue
                  ? "bg-brand-green border-brand-green text-foreground shadow-md hover:opacity-90"
                  : "hover:bg-brand-green hover:border-brand-green hover:text-foreground"
              }`}
            >
              {issue}
            </Button>
          </motion.div>
        ))}

        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => setSelected(null)}
                variant="outline"
                className="hover:border-brand-green hover:bg-brand-green hover:text-foreground rounded-full border-2 border-dashed border-gray-400 text-gray-600"
              >
                Clear
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selected || "all"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <FocusCards cards={filteredCards} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
