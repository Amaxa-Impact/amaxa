import { Suspense } from "react";

import Footer from "~/app/(marketing)/_components/footer";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  return (
    <>
      <Suspense fallback="..."></Suspense>
      {children}
      <Footer />
    </>
  );
}
