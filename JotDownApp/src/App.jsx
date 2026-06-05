import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/common/AppShell'
import LandingPage from './pages/LandingPage'
import NotesPage from './pages/NotesPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import PlansPage from './pages/PlansPage'
import WorkspacesPage from './pages/WorkspacesPage'
import LabelsPage from './pages/LabelsPage'
import NotFoundPage from './pages/NotFoundPage'
import { ToastProvider } from './components/common/Toast'
import {
  AuthProvider,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from './features/auth'

// Admin features
import AdminLayout from './features/admin/AdminLayout'
import AdminDashboard from './features/admin/AdminDashboard'
import AdminUsers from './features/admin/AdminUsers'
import AdminPlans from './features/admin/AdminPlans'
import AdminPayments from './features/admin/AdminPayments'
import AdminReports from './features/admin/AdminReports'
import AdminActivityLogs from './features/admin/AdminActivityLogs'

import SharedNotesGalleryPage from './pages/SharedNotesGalleryPage'
import SharedNotePage from './pages/SharedNotePage'

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Shared Note (No auth wrapper needed, standalone page) */}
            <Route path="/shared/note/:id" element={<SharedNotePage />} />

            {/* Main User App */}
            <Route path="/" element={<AppShell />}>
              <Route index element={<Navigate to="/landing" replace />} />
              <Route path="landing" element={<LandingPage />} />
              <Route path="notes" element={<NotesPage />} />
              <Route path="shared-notes" element={<SharedNotesGalleryPage />} />
              <Route path="workspaces" element={<WorkspacesPage />} />
              <Route path="labels" element={<LabelsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="plans" element={<PlansPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="reset-password" element={<ResetPasswordPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin Workspace */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="plans" element={<AdminPlans />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="activity-logs" element={<AdminActivityLogs />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
