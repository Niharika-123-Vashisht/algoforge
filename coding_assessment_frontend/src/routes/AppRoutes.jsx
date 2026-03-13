import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../layouts/AppLayout.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import LoginPage from "../features/auth/pages/LoginPage.jsx";
import RegisterPage from "../features/auth/pages/RegisterPage.jsx";
import OAuthCallback from "../features/auth/pages/OAuthCallback.jsx";
import ProblemsPage from "../features/problems/pages/ProblemsPage.jsx";
import ProblemDetailPage from "../features/problems/pages/ProblemDetailPage.jsx";
import SubmissionList from "../features/submissions/pages/SubmissionList.jsx";
import SubmissionDetail from "../features/submissions/pages/SubmissionDetail.jsx";
import Profile from "../features/profile/pages/Profile.jsx";
import Leaderboard from "../features/leaderboard/pages/Leaderboard.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/problems" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />

      <Route
        path="/problems"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProblemsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/problems/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProblemDetailPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/submissions"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SubmissionList />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Leaderboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/submissions/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SubmissionDetail />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
