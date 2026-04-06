import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const Login = () => <div>Login Page</div>;
const CreatorDashboard = () => <div>Creator Dashboard</div>;
const SubscriberFeed = () => <div>Subscriber Feed</div>;

const ProtectedRoute = ({ children, allowedRoles }) => {
  return children; 
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        
        <Route path="/creator/*" element={<ProtectedRoute allowedRoles={['creator']}><CreatorDashboard /></ProtectedRoute>} />
        <Route path="/subscriber/*" element={<ProtectedRoute allowedRoles={['subscriber']}><SubscriberFeed /></ProtectedRoute>} />
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;