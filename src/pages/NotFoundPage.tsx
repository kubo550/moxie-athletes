import { Link } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { usePageMeta } from '@/utils/usePageMeta';

export const NotFoundPage = () => {
  usePageMeta({ title: 'Not Found · Moxie Athletes', noindex: true });
  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <h1 className="font-display text-7xl text-accent-moxie">404</h1>
        <p className="text-white/70 mt-4 mb-6">
          That page doesn't exist on this band.
        </p>
        <Link
          to="/"
          className="text-white underline underline-offset-4 hover:text-accent-moxie"
        >
          Back home
        </Link>
      </div>
    </AppShell>
  );
};
