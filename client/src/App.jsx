import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';

const CreatorDashboard = () => <div className="p-10"><h1>Creator Dashboard</h1></div>;
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
          path="/creator/*" 
          element={
            <ProtectedRoute allowedRoles={['creator']}>
              <CreatorDashboard />
            </ProtectedRoute>
          } 
        />
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