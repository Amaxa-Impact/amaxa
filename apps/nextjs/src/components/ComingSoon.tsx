import { Tooltip, TooltipContent, TooltipTrigger } from "@amaxa/ui/tooltip";

export default function ComingSoon({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipContent>Coming Soon!</TooltipContent>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
    </Tooltip>
  );
}
