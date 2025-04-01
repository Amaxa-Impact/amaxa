"use client";

import { cn } from "@amaxa/ui";

import { MagicCard, MagicContainer } from "./magic-card";

interface CardProps {
  title: string;
  description: string;
  className?: string;
}

interface CardContainerProps {
  cards: CardProps[];
  className?: string;
}

const CardContainer = ({ cards, className }: CardContainerProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {cards.map((card, index) => (
        <div key={index} className="group relative block h-full w-full p-2">
          <MagicContainer>
            <Card className="card m-4" key={index}>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </Card>
          </MagicContainer>
        </div>
      ))}
    </div>
  );
};

export default CardContainer;

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <MagicCard
      className={cn(
        "pointer-events-none relative h-full w-full overflow-hidden rounded-2xl border border-white/[0.2] bg-[radial-gradient(var(--mask-size)_circle_at_var(--mouse-x)_var(--mouse-y),#ffaa40_0,#9c40ff_50%,transparent_100%)] p-4",
        className,
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </MagicCard>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4
      className={cn(
        "mt-4 text-xl font-bold tracking-wide text-primary",
        className,
      )}
    >
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-8 text-sm leading-relaxed tracking-wide text-primary",
        className,
      )}
    >
      {children}
    </p>
  );
};
