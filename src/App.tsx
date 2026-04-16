import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import AdminLogin from './pages/auth/AdminLogin';
import UserLogin from './pages/auth/UserLogin';
import UserSignup from './pages/auth/UserSignup';
import AdminFollowers from './pages/admin/AdminFollowers';
import Home from './pages/user/Home';
import AdminBlog from './pages/admin/AdminBlog';
import CreateBlog from './components/admin/CreateBlog';
import EditBlog from './components/admin/EditBlog';
import BlogDetails from './pages/user/BlogDetails';
import AuthorProfile from './pages/user/AuthorProfile';
import ProfileModal from './components/modals/ProfileModal';
import FollowingModal from './components/modals/FollowingModal';
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
            path="/admin/blog"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/followers"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminFollowers />
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
          <Route path="/author/:identifier" element={<AuthorProfile />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
        <ProfileModal />
        <FollowingModal />
      </Router>
      <Toaster richColors position="top-right" />
    </>
  );
}

export default App;
