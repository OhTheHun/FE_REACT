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
  AuthGuard,
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
              <Route path="notes" element={<AuthGuard allowedRoles={['user']}><NotesPage /></AuthGuard>} />
              <Route path="shared-notes" element={<SharedNotesGalleryPage />} />
              <Route path="workspaces" element={<AuthGuard allowedRoles={['user']}><WorkspacesPage /></AuthGuard>} />
              <Route path="labels" element={<AuthGuard allowedRoles={['user']}><LabelsPage /></AuthGuard>} />
              <Route path="profile" element={<AuthGuard allowedRoles={['user']}><ProfilePage /></AuthGuard>} />
              <Route path="settings" element={<AuthGuard allowedRoles={['user']}><SettingsPage /></AuthGuard>} />
              <Route path="plans" element={<PlansPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="reset-password" element={<ResetPasswordPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin Workspace */}
            <Route path="/admin" element={<AuthGuard allowedRoles={['admin']}><AdminLayout /></AuthGuard>}>
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
