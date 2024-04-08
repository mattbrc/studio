interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div>
      <header className="fixed left-0 right-0 top-0 z-40 flex h-20 items-center justify-center">
        <p className="font-mono font-bold text-[hsl(161,78%,58%)]">
          ACID GAMBIT
        </p>
      </header>
      <main className="flex-1">
        <div className="h-screen snap-y snap-mandatory overflow-scroll">
          {children}
        </div>
      </main>
    </div>
  );
}
