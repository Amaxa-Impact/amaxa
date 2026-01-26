"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@amaxa/ui/dialog";
import { Button } from "@amaxa/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

interface PathwayResult {
  title: string;
  description: string;
  link: string;
  matchScore: number;
}

interface Question {
  id: string;
  question: string;
  options: Array<{
    label: string;
    value: string;
    pathways: {
      cohorts?: number;
      research?: number;
      partnerships?: number;
      network?: number;
    };
  }>;
}

const questions: Question[] = [
  {
    id: "role",
    question: "What best describes you?",
    options: [
      {
        label: "High school student",
        value: "high-school",
        pathways: { cohorts: 10, research: 2, network: 3 },
      },
      {
        label: "Undergraduate student",
        value: "undergrad",
        pathways: { research: 10, network: 5, cohorts: 1 },
      },
      {
        label: "Graduate/Postgraduate student",
        value: "grad",
        pathways: { research: 10, partnerships: 3, network: 4 },
      },
      {
        label: "Professional",
        value: "professional",
        pathways: { partnerships: 10, network: 6, research: 2 },
      },
    ],
  },
  {
    id: "location",
    question: "Where are you located?",
    options: [
      {
        label: "Colorado, USA",
        value: "colorado",
        pathways: { network: 10, cohorts: 5, research: 5, partnerships: 5 },
      },
      {
        label: "Outside Colorado",
        value: "outside",
        pathways: { cohorts: 5, research: 5, partnerships: 5, network: 1 },
      },
    ],
  },
  {
    id: "interest",
    question: "What interests you most?",
    options: [
      {
        label: "Hands-on research projects",
        value: "research",
        pathways: { research: 10, cohorts: 4, network: 3 },
      },
      {
        label: "Structured learning programs",
        value: "learning",
        pathways: { cohorts: 10, research: 5, network: 2 },
      },
      {
        label: "Professional networking",
        value: "networking",
        pathways: { network: 10, partnerships: 8, research: 2 },
      },
      {
        label: "Career development",
        value: "career",
        pathways: { partnerships: 10, network: 7, research: 3 },
      },
    ],
  },
  {
    id: "commitment",
    question: "What's your time commitment?",
    options: [
      {
        label: "Full-time program",
        value: "full-time",
        pathways: { cohorts: 8, research: 7, partnerships: 5 },
      },
      {
        label: "Part-time/flexible",
        value: "part-time",
        pathways: { research: 8, network: 7, partnerships: 6 },
      },
      {
        label: "Events & networking only",
        value: "events",
        pathways: { network: 10, partnerships: 7 },
      },
    ],
  },
];

const pathwayInfo = {
  cohorts: {
    title: "Ámaxa Cohorts",
    description: "for high school students",
    link: "/pathways/cohorts",
  },
  research: {
    title: "Ámaxa Research",
    description: "for undergrad & postgrad students",
    link: "/pathways/research",
  },
  partnerships: {
    title: "Ámaxa Partnerships",
    description: "for professionals",
    link: "/pathways/partnerships",
  },
  network: {
    title: "Ámaxa Network",
    description: "for students & professionals in Colorado",
    link: "/pathways/network",
  },
};

interface PathwayQuestionnaireProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PathwayQuestionnaire({
  open,
  onOpenChange,
}: PathwayQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<PathwayResult | null>(null);

  const handleAnswer = (value: string) => {
    const question = questions[currentStep];
    const selectedOption = question.options.find((opt) => opt.value === value);

    if (selectedOption) {
      const newAnswers = { ...answers, [question.id]: value };
      setAnswers(newAnswers);

      // Calculate scores
      const scores: Record<string, number> = {
        cohorts: 0,
        research: 0,
        partnerships: 0,
        network: 0,
      };

      // Add current answer scores
      Object.entries(selectedOption.pathways).forEach(([pathway, score]) => {
        scores[pathway as keyof typeof scores] += score;
      });

      // Add previous answer scores
      Object.entries(newAnswers).forEach(([qId, ansValue]) => {
        const q = questions.find((q) => q.id === qId);
        if (q) {
          const opt = q.options.find((o) => o.value === ansValue);
          if (opt) {
            Object.entries(opt.pathways).forEach(([pathway, score]) => {
              scores[pathway as keyof typeof scores] += score;
            });
          }
        }
      });

      // Move to next step or show results
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Find the pathway with highest score
        const topPathway = Object.entries(scores).reduce((a, b) =>
          scores[a[0]] > scores[b[0]] ? a : b,
        )[0] as keyof typeof pathwayInfo;

        setResult({
          title: pathwayInfo[topPathway].title,
          description: pathwayInfo[topPathway].description,
          link: pathwayInfo[topPathway].link,
          matchScore: scores[topPathway],
        });
      }
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Remove the answer for the current step
      const question = questions[currentStep];
      const newAnswers = { ...answers };
      delete newAnswers[question.id];
      setAnswers(newAnswers);
    }
  };

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <style>{`
        [data-slot="dialog-overlay"] {
          background-color: rgba(0, 0, 0, 0.6) !important;
          backdrop-filter: blur(8px) !important;
          -webkit-backdrop-filter: blur(8px) !important;
        }
      `}</style>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:max-w-2xl bg-white shadow-2xl border-2 border-neutral-200 z-[60]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-[#3B3B3B] flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#BCD96C]" />
            Find Your Perfect Pathway
          </DialogTitle>
          <DialogDescription className="text-base text-neutral-600">
            Answer a few quick questions to discover which Ámaxa pathway is
            right for you
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {/* Progress Bar */}
          {!result && (
            <div className="mb-6">
              <div className="flex justify-between text-xs text-neutral-500 mb-2">
                <span>Question {currentStep + 1} of {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#BCD96C] transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Question or Result */}
          {result ? (
            <div className="text-center py-8">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#BCD96C]/20 mb-4">
                  <Sparkles className="h-8 w-8 text-[#BCD96C]" />
                </div>
                <h3 className="text-2xl font-semibold text-[#3B3B3B] mb-2">
                  We found your match!
                </h3>
                <p className="text-neutral-600 mb-6">
                  Based on your answers, this pathway is perfect for you:
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#BCD96C]/10 to-[#BCD96C]/5 border-2 border-[#BCD96C]/30 rounded-xl p-8 mb-6">
                <h4 className="text-3xl font-semibold text-[#3B3B3B] mb-2">
                  {result.title}
                </h4>
                <p className="text-lg text-neutral-600 mb-6">
                  {result.description}
                </p>
                <a href={result.link}>
                  <Button
                    size="lg"
                    className="bg-[#BCD96C] hover:bg-[#BCD96C]/90 text-[#3B3B3B] font-semibold"
                  >
                    Explore {result.title}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>

              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={handleReset}>
                  Start Over
                </Button>
                <Button variant="ghost" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-[#3B3B3B] mb-6">
                  {questions[currentStep].question}
                </h3>
                <div className="space-y-3">
                  {questions[currentStep].options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      className="w-full text-left p-4 rounded-lg border-2 border-neutral-200 hover:border-[#BCD96C] hover:bg-[#BCD96C]/5 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base font-medium text-[#3B3B3B] group-hover:text-[#3B3B3B]">
                          {option.label}
                        </span>
                        <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-[#BCD96C] transition-transform group-hover:translate-x-1" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-4">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                >
                  Back
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                >
                  Skip for now
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
