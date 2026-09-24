import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/admin.css';

export default function ProtectedRoute({ requireAdmin = true }) {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-spinner"></div>
        <p>Verifying access...</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requireAdmin && (!profile || profile.role !== 'admin')) {
    return (
      <div className="admin-unauthorized">
        <div className="admin-unauthorized-card">
          <h2>Access Denied</h2>
          <p>You do not have administrator privileges to view this page.</p>
          
          <div style={{ background: '#fef2f2', padding: '10px', marginTop: '10px', marginBottom: '20px', borderRadius: '5px', fontSize: '12px', textAlign: 'left', color: '#991b1b' }}>
            <strong>Debug Info:</strong><br/>
            Session Exists: {session ? 'Yes' : 'No'}<br/>
            User ID: {session?.user?.id || 'None'}<br/>
            Profile Loaded: {profile ? 'Yes' : 'No'}<br/>
            Profile Role: {profile?.role || 'N/A'}<br/>
            <em>(Check browser console for detailed Supabase errors)</em>
          </div>

          <button className="admin-btn-primary" onClick={() => window.location.href = '/'}>Return to Home</button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
