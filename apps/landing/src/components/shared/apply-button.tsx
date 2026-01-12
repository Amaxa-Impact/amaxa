/**
 * ApplyButton - CTA button that links to the Airtable application form
 *
 * Available variants:
 * - "color": Green background with dark border
 * - "black": Dark background with white text
 * - "outline": White background with dark border
 *
 * Usage:
 * <ApplyButton variant="color">Apply Now</ApplyButton>
 */

const APPLY_URL = "https://airtable.com/appPR9mkslbn3U8YZ/shrHHUtRzK4DqKt3F";

interface ApplyButtonProps {
  variant: "color" | "black" | "outline";
  children: React.ReactNode;
}

export function ApplyButton({ variant, children }: ApplyButtonProps) {
  const baseClasses =
    "inline-flex items-center rounded-full px-5 py-2 text-sm font-light transition-colors sm:px-6 md:px-8 md:py-3 md:text-base";

  const variantClasses = {
    color:
      "border border-[#3B3B3B] bg-[#b9d66e] text-[#3B3B3B] hover:bg-[#a8c55f]",
    black: "bg-[#3B3B3B] text-white hover:bg-[#2a2a2a]",
    outline:
      "border border-[#3B3B3B] bg-white text-[#3B3B3B] hover:bg-gray-100",
  };

  return (
    <a href={APPLY_URL} className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </a>
  );
}

/**
 * LinkButton - Generic styled link button
 *
 * Usage:
 * <LinkButton href="/projects" variant="outline">View Projects</LinkButton>
 */
interface LinkButtonProps {
  href: string;
  variant: "color" | "black" | "outline";
  children: React.ReactNode;
}

export function LinkButton({ href, variant, children }: LinkButtonProps) {
  const baseClasses =
    "inline-flex items-center rounded-full px-5 py-2 text-sm font-light transition-colors sm:px-6 md:px-8 md:py-3 md:text-base";

  const variantClasses = {
    color:
      "border border-[#3B3B3B] bg-[#b9d66e] text-[#3B3B3B] hover:bg-[#a8c55f]",
    black: "bg-[#3B3B3B] text-white hover:bg-[#2a2a2a]",
    outline:
      "border border-[#3B3B3B] bg-white text-[#3B3B3B] hover:bg-gray-100",
  };

  return (
    <a href={href} className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </a>
  );
}
