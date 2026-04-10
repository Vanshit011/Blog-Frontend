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
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/blog" element={<AdminBlog />} />
        <Route path="/admin/blog/create" element={<CreateBlog />} />
        <Route path="/admin/blog/edit/:id" element={<EditBlog />} />

        {/* user routes */}
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/blog/:id" element={<BlogDetails />} />

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
