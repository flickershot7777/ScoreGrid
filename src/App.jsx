import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Exam from './pages/Exam';
import Results from './pages/Results';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCategories from './pages/admin/ManageCategories';
import ManageExams from './pages/admin/ManageExams';
import ManageQuestions from './pages/admin/ManageQuestions';

import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />

          {/* Protected - User */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/exam/:examId" element={<ProtectedRoute><Exam /></ProtectedRoute>} />
          <Route path="/results/:resultId" element={<ProtectedRoute><Results /></ProtectedRoute>} />

          {/* Protected - OPCO Admin */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><ManageCategories /></AdminRoute>} />
          <Route path="/admin/exams" element={<AdminRoute><ManageExams /></AdminRoute>} />
          <Route path="/admin/exams/:examId/questions" element={<AdminRoute><ManageQuestions /></AdminRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
