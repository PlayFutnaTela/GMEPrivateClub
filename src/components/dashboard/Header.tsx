import { UserNav } from './UserNav';

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-foreground">
            Visão Geral
          </h2>
        </div>

        <UserNav />
      </div>
    </header>
  );
};
