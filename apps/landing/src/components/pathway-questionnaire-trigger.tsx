"use client";

import { useState } from "react";
import { Button } from "@amaxa/ui/button";
import { Sparkles } from "lucide-react";
import { PathwayQuestionnaire } from "./pathway-questionnaire";

interface PathwayQuestionnaireTriggerProps {
  variant?: "inline" | "floating";
}

export function PathwayQuestionnaireTrigger({
  variant = "inline",
}: PathwayQuestionnaireTriggerProps) {
  const [open, setOpen] = useState(false);

  if (variant === "floating") {
    return (
      <>
        <div className="fixed bottom-8 right-8 z-40 hidden md:block">
          <Button
            onClick={() => setOpen(true)}
            size="lg"
            className="bg-[#BCD96C] hover:bg-[#BCD96C]/90 text-[#3B3B3B] font-semibold shadow-lg hover:shadow-xl transition-all duration-200 rounded-full px-6 py-6 h-auto"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Find Your Pathway
          </Button>
        </div>
        <PathwayQuestionnaire open={open} onOpenChange={setOpen} />
      </>
    );
  }

  return (
    <>
      <div className="w-full mb-6">
        <Button
          onClick={() => setOpen(true)}
          size="lg"
          className="w-full bg-[#BCD96C] hover:bg-[#BCD96C]/90 text-[#3B3B3B] font-semibold"
        >
          <Sparkles className="h-5 w-5 mr-2" />
          Find Your Perfect Pathway
        </Button>
      </div>
      <PathwayQuestionnaire open={open} onOpenChange={setOpen} />
    </>
  );
}
