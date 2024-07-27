import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@amaxa/ui/accordion";

export default function FAQ() {
  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>

      <Accordion type="multiple">
        <AccordionItem value="question-1">
          <AccordionTrigger className="flex items-center justify-start space-x-2">
            Do we work directly with the nonprofit?
          </AccordionTrigger>
          <AccordionContent>
            We personally match you to one of our high-impact projects with
            global nonprofits
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="question-2"></AccordionItem>
      </Accordion>
    </div>
  );
}
