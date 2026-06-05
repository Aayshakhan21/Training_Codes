import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';

// Auth
import LoginPage from './pages/auth/LoginPage';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCourses from './pages/admin/AdminCourses';
import AdminStudents from './pages/admin/AdminStudents';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminEnrollments from './pages/admin/AdminEnrollments';
import AdminCertificates from './pages/admin/AdminCertificates';
import AdminReports from './pages/admin/AdminReports';

// User
import UserDashboard from './pages/user/UserDashboard';
import UserCourses from './pages/user/UserCourses';
import UserBrowse from './pages/user/UserBrowse';
import UserGrades from './pages/user/UserGrades';
import UserCertificates from './pages/user/UserCertificates';
import UserHelp from './pages/user/UserHelp';

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard'} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/courses" element={<ProtectedRoute role="ADMIN"><AdminCourses /></ProtectedRoute>} />
      <Route path="/admin/students" element={<ProtectedRoute role="ADMIN"><AdminStudents /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute role="ADMIN"><AdminAnalytics /></ProtectedRoute>} />
      <Route path="/admin/enrollments" element={<ProtectedRoute role="ADMIN"><AdminEnrollments /></ProtectedRoute>} />
      <Route path="/admin/certificates" element={<ProtectedRoute role="ADMIN"><AdminCertificates /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute role="ADMIN"><AdminReports /></ProtectedRoute>} />

      {/* User routes */}
      <Route path="/user/dashboard" element={<ProtectedRoute role="USER"><UserDashboard /></ProtectedRoute>} />
      <Route path="/user/courses" element={<ProtectedRoute role="USER"><UserCourses /></ProtectedRoute>} />
      <Route path="/user/browse" element={<ProtectedRoute role="USER"><UserBrowse /></ProtectedRoute>} />
      <Route path="/user/grades" element={<ProtectedRoute role="USER"><UserGrades /></ProtectedRoute>} />
      <Route path="/user/certificates" element={<ProtectedRoute role="USER"><UserCertificates /></ProtectedRoute>} />
      <Route path="/user/help" element={<ProtectedRoute role="USER"><UserHelp /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
