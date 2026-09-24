import React from 'react';
import { Database, ShieldCheck, LayoutTemplate } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function AdminDashboard() {
  const { profile } = useAuth();

  return (
    <div>
      <div className="admin-page-header">
        <h2>Welcome back, {profile?.full_name || 'Admin'}!</h2>
        <p>Manage your LearnDepth website content from one place.</p>
      </div>

      <div className="admin-dashboard-grid">
        <div className="admin-card">
          <div className="admin-card-icon">
            <Database size={24} />
          </div>
          <h3>Content Management</h3>
          <p>Manage website content, courses, and programs. (Modules coming soon)</p>
        </div>

        <div className="admin-card">
          <div className="admin-card-icon">
            <LayoutTemplate size={24} />
          </div>
          <h3>Website Layout</h3>
          <p>Control dynamic LearnDepth homepage sections. (Modules coming soon)</p>
        </div>

        <div className="admin-card">
          <div className="admin-card-icon">
            <ShieldCheck size={24} />
          </div>
          <h3>Admin Access</h3>
          <p>Manage authorized administrators and user roles.</p>
        </div>
      </div>
    </div>
  );
}
