import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ExamList from './pages/ExamList';
import ExamTaking from './pages/ExamTaking';
import Results from './pages/Results';
import AdminPanel from './pages/AdminPanel';
import LandingPage from './pages/LandingPage';
import AdminRegister from './pages/AdminRegister';
import QuestionManagement from './components/admin/QuestionManagement';
import StudentDashboard from './components/student/StudentDashboard';
import AvailableExams from './components/student/AvailableExams';
import SystemSettings from './components/admin/SystemSettings';
// Add this import at the top with other imports
import AdminDashboard from './components/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/exams" element={
              <ProtectedRoute>
                <ExamList />
              </ProtectedRoute>
            } />
            <Route path="/exam/:examId" element={
              <ProtectedRoute>
                <ExamTaking />
              </ProtectedRoute>
            } />
            <Route path="/results" element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } />
            <Route path="/admin-register" element={<AdminRegister />} />
            <Route path="/admin/exam/:examId/questions" element={
              <ProtectedRoute>
                <QuestionManagement />
              </ProtectedRoute>
            } />
            <Route path="/student/available-exams" element={
              <ProtectedRoute role="student">
                <AvailableExams />
              </ProtectedRoute>
            } />
            <Route path="/student/dashboard" element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute role="admin">
                <AdminDashboard>
                  <SystemSettings />
                </AdminDashboard>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
