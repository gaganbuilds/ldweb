import React, { useState } from 'react';
import { Menu, ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function AdminHeader({ onMenuClick }) {
  const { profile, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="admin-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="admin-mobile-toggle" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <div className="admin-header-title">
          <h1>Dashboard</h1>
        </div>
      </div>

      <div className="admin-header-right">
        <div style={{ position: 'relative' }}>
          <button 
            className="admin-profile-trigger"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="admin-avatar">
              {getInitials(profile?.full_name)}
            </div>
            <span className="admin-profile-name">
              {profile?.full_name || 'Admin'}
            </span>
            <ChevronDown size={16} />
          </button>

          {dropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              minWidth: '200px',
              zIndex: 50
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{profile?.full_name || 'Administrator'}</div>
                <div style={{ color: '#6b7280', fontSize: '12px' }}>{profile?.email}</div>
              </div>
              <div style={{ padding: '8px' }}>
                <button 
                  onClick={() => signOut()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    width: '100%', padding: '8px', background: 'none', border: 'none',
                    textAlign: 'left', cursor: 'pointer', borderRadius: '4px',
                    color: '#ef4444', fontSize: '14px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
