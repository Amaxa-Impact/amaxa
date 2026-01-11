import { TopNavbar } from "@/components/navbar/top-navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <TopNavbar />
      {children}
    </div>
  );
}
