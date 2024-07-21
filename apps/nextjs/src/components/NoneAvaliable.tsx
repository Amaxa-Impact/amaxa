export default function NoneAvaliable({
  text,
  actionString,
  actionButton,
}: {
  text: string;
  actionString: string;
  actionButton: React.ReactNode;
}) {
  return (
    <div className="h-min-[300px] flex h-full flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">{text}</h3>
        <p className="text-sm text-muted-foreground">{actionString}</p>
        {actionButton}
      </div>
    </div>
  );
}
