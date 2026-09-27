import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/admin.css';

export default function AdminResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSessionValid, setIsSessionValid] = useState(true);

  const { session, updatePassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Give it a brief moment for Supabase to process the recovery hash from the URL
    // If after 1 second there's no session, the link is likely invalid/expired.
    const timer = setTimeout(() => {
      if (!session) {
        setIsSessionValid(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [session]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await updatePassword(newPassword);
      
      if (error) throw error;
      
      setMessage('Your password has been updated successfully.');
      
      // Optionally redirect after a short delay
      setTimeout(() => {
        navigate('/admin/login');
      }, 3000);
      
    } catch (error) {
      setError('Failed to update password. Your session may have expired.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-app">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <img src="/logo.svg" alt="LearnDepth" className="admin-login-logo" onError={(e) => e.target.style.display = 'none'} />
          
          <h2>Reset Your Password</h2>
          <p>Create a new password for your LearnDepth admin account.</p>

          {!isSessionValid ? (
            <div style={{ textAlign: 'center' }}>
              <div className="admin-error-alert" style={{ marginBottom: '20px' }}>
                Your password reset link is invalid or has expired.
              </div>
              <button 
                type="button" 
                className="admin-btn-primary"
                onClick={() => navigate('/admin/login')}
              >
                Request a New Reset Link
              </button>
            </div>
          ) : message ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ background: '#ecfdf5', color: '#065f46', padding: '16px', borderRadius: '6px', marginBottom: '20px', fontSize: '15px', fontWeight: '500' }}>
                {message}
              </div>
              <button 
                type="button" 
                className="admin-btn-primary"
                onClick={() => navigate('/admin/login')}
              >
                Go to Admin Login
              </button>
            </div>
          ) : (
            <>
              {error && <div className="admin-error-alert">{error}</div>}

              <form onSubmit={handleUpdatePassword}>
                <div className="admin-input-group">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    className="admin-input" 
                    placeholder="Minimum 8 characters" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                <div className="admin-input-group">
                  <label>Confirm New Password</label>
                  <input 
                    type="password" 
                    className="admin-input" 
                    placeholder="Must match new password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                
                <button type="submit" className="admin-btn-primary" disabled={loading || !session}>
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
                
                <button 
                  type="button" 
                  onClick={() => navigate('/admin/login')} 
                  style={{ background: 'none', border: 'none', color: '#6366f1', marginTop: '16px', cursor: 'pointer', width: '100%', fontSize: '14px' }}
                >
                  Back to Admin Login
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
