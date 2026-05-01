import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type AppShellProps = {
  children: ReactNode;
  bandId?: string;
  hideNav?: boolean;
};

export const AppShell = ({ children, bandId, hideNav }: AppShellProps) => {
  const homeHref = bandId ? `/g/${bandId}/home` : '/';

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-x-hidden">
      <div className="fixed inset-0 -z-10 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(57,255,20,0.06),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(255,255,255,0.04),_transparent_60%)]" />

      {!hideNav && (
        <header className="sticky top-0 z-30 backdrop-blur-md bg-black/60 border-b border-white/10">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link to={homeHref} className="flex items-center gap-2">
              <span className="font-display text-2xl tracking-wider text-white">
                MOXIE
              </span>
              <span className="font-display text-2xl tracking-wider text-accent-moxie">
                ATHLETES
              </span>
            </Link>
            <Link
              to="/about"
              className="text-xs uppercase tracking-widest text-white/60 hover:text-white"
            >
              About
            </Link>
          </div>
        </header>
      )}

      <main className="flex-1 w-full max-w-2xl mx-auto pb-24">{children}</main>
    </div>
  );
};
