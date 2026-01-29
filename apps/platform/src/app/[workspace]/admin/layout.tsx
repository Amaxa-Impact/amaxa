import { WorkspaceNav } from "./nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background min-h-screen">
      <WorkspaceNav />
      <main>{children}</main>
    </div>
  );
}
