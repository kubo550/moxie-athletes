import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import { BandEntryPage } from '@/pages/BandEntryPage';
import { BandHomePage } from '@/pages/BandHomePage';
import { BandEditPage } from '@/pages/BandEditPage';
import { BreathingPage } from '@/pages/BreathingPage';
import { ChatListPage } from '@/pages/ChatListPage';
import { ChatPage } from '@/pages/ChatPage';
import { TrackerPage } from '@/pages/TrackerPage';
import { PostGamePage } from '@/pages/PostGamePage';
import { WallpaperPage } from '@/pages/WallpaperPage';
import { CreateTeamPage } from '@/pages/CreateTeamPage';
import { JoinTeamPage } from '@/pages/JoinTeamPage';
import { CoachDashboardPage } from '@/pages/CoachDashboardPage';
import { AboutPage } from '@/pages/AboutPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />

        <Route path="/g/:bandId" element={<BandEntryPage />} />
        <Route path="/g/:bandId/home" element={<BandHomePage />} />
        <Route path="/g/:bandId/edit" element={<BandEditPage />} />
        <Route path="/g/:bandId/breathe" element={<BreathingPage />} />
        <Route path="/g/:bandId/coach" element={<ChatListPage />} />
        <Route path="/g/:bandId/coach/:coachId" element={<ChatPage />} />
        <Route path="/g/:bandId/tracker" element={<TrackerPage />} />
        <Route path="/g/:bandId/postgame" element={<PostGamePage />} />
        <Route path="/g/:bandId/wallpaper" element={<WallpaperPage />} />

        <Route path="/team/new" element={<CreateTeamPage />} />
        <Route path="/join/:teamCode" element={<JoinTeamPage />} />
        <Route
          path="/team/:teamCode/coach"
          element={<CoachDashboardPage />}
        />

        <Route path="/breathe" element={<BreathingPage />} />
        <Route path="/coach" element={<ChatListPage />} />
        <Route path="/coach/:coachId" element={<ChatPage />} />
        <Route path="/tracker" element={<TrackerPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
