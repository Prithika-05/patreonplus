import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import CreatorLayout from '@/components/layout/CreatorLayout';
import SubscriberLayout from '@/components/layout/SubscriberLayout';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import DashboardHome from '@/pages/creator/DashboardHome';
import Tiers from '@/pages/creator/Tiers';
import Contents from '@/pages/creator/Contents';
import MySubscriptions from '@/pages/subscriber/MySubscriptions';
import CreatorProfile from '@/pages/subscriber/CreatorProfile';
import Feed from '@/pages/subscriber/Feed';
import Unauthorized from '@/pages/auth/Unauthorized';

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
          path="/subscriber" 
          element={
            <ProtectedRoute allowedRoles={['subscriber']}>
              <SubscriberLayout />
            </ProtectedRoute>
          } 
        >
          <Route path="feed" element={<Feed />} />
          <Route path="subscriptions" element={<MySubscriptions />} />
          <Route path="explore" element={<CreatorProfile />} />
          <Route index element={<Navigate to="/subscriber/feed" replace />} />
        </Route>
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;