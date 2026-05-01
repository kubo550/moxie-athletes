import { Link, useParams } from 'react-router-dom';
import { CoachChatWindow } from '@/components/CoachChatWindow';
import { getCoachById } from '@/config/coaches';
import { AppShell } from '@/components/AppShell';
import { usePageMeta } from '@/utils/usePageMeta';

export const ChatPage = () => {
  const { coachId, bandId } = useParams<{ coachId: string; bandId?: string }>();
  const coach = coachId ? getCoachById(coachId) : undefined;
  const backHref = bandId ? `/g/${bandId}/coach` : '/coach';
  usePageMeta({
    title: coach
      ? `${coach.name} — Moxie Coach`
      : 'AI Coach — Moxie Athletes',
    noindex: true,
  });

  if (!coach) {
    return (
      <AppShell bandId={bandId}>
        <div className="px-6 py-10 text-center">
          <p className="text-white/70 mb-4">Coach not found.</p>
          <Link
            to={backHref}
            className="text-accent-moxie underline underline-offset-4"
          >
            Back to coaches
          </Link>
        </div>
      </AppShell>
    );
  }

  return <CoachChatWindow coach={coach} backHref={backHref} />;
};
