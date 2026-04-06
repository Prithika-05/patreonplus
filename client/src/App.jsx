import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import CreatorLayout from '@/components/layout/CreatorLayout';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import DashboardHome from '@/pages/creator/DashboardHome';
import Tiers from '@/pages/creator/Tiers';
import Contents from '@/pages/creator/Contents';

const SubscriberFeed = () => <div className="p-10"><h1>Subscriber Feed</h1></div>;
const Unauthorized = () => <div className="p-10"><h1>403 Unauthorized</h1></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        <Route 
          path="/creator" 
          element={
            <ProtectedRoute allowedRoles={['creator']}>
              <CreatorLayout />
            </ProtectedRoute>
          } 
        >
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="tiers" element={<Tiers />} />
          <Route path="contents" element={<Contents />} />
          <Route index element={<Navigate to="/creator/dashboard" replace />} />
        </Route>

        <Route 
          path="/subscriber/*" 
          element={
            <ProtectedRoute allowedRoles={['subscriber']}>
              <SubscriberFeed />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;