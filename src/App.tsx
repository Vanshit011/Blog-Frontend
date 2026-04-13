import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import AdminLogin from './pages/auth/AdminLogin';
import UserLogin from './pages/auth/UserLogin';
import UserSignup from './pages/auth/UserSignup';
import AdminDashboard from './pages/admin/AdminDashboard';
import Home from './pages/user/Home';
import AdminBlog from './pages/admin/AdminBlog';
import CreateBlog from './components/admin/CreateBlog';
import EditBlog from './components/admin/EditBlog';
import BlogDetails from './pages/user/BlogDetails';
import ProtectedRoute from './route/ProtectedRoute';
import { Toaster } from 'sonner';
import './App.css';

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blog"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blog/create"
            element={
              <ProtectedRoute allowedRole="admin">
                <CreateBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blog/edit/:id"
            element={
              <ProtectedRoute allowedRole="admin">
                <EditBlog />
              </ProtectedRoute>
            }
          />

          {/* user routes */}
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/home" element={<Home />} />
          <Route path="/blog/:id" element={<BlogDetails />} />

          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Router>
      <Toaster richColors position="top-right" />
    </>
  );
}

export default App;
