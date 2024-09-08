import Footer from "~/app/(marketing)/_components/footer";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
