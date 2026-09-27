import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/admin.css';

export default function AdminLogin() {
  const [isResetMode, setIsResetMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { signIn, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        throw error;
      }
      
      navigate('/admin/dashboard');
    } catch (error) {
      if (error.message.includes('Invalid login credentials')) {
        setError('Invalid email or password.');
      } else {
        setError('Something went wrong. Please try again.');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const { error } = await resetPassword(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`
      });

      if (error) throw error;

      setMessage('Password reset link sent! Check your email.');
    } catch (error) {
      setError('Failed to send reset link. Please check your email and try again.');
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
          
          <h2>{isResetMode ? 'Reset Password' : 'Admin Portal'}</h2>
          <p>{isResetMode ? 'Enter your email to receive a password reset link.' : 'Sign in to manage LearnDepth'}</p>

          {error && <div className="admin-error-alert">{error}</div>}
          {message && <div style={{ background: '#ecfdf5', color: '#065f46', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{message}</div>}

          {isResetMode ? (
            <form onSubmit={handleResetPassword}>
              <div className="admin-input-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  className="admin-input" 
                  placeholder="admin@learndepth.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <button type="submit" className="admin-btn-primary" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              
              <button 
                type="button" 
                onClick={() => { setIsResetMode(false); setError(null); setMessage(null); }} 
                style={{ background: 'none', border: 'none', color: '#6366f1', marginTop: '16px', cursor: 'pointer', width: '100%', fontSize: '14px' }}
              >
                Back to Admin Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <div className="admin-input-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  className="admin-input" 
                  placeholder="admin@learndepth.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="admin-input-group">
                <label>Password</label>
                <input 
                  type="password" 
                  className="admin-input" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <button type="submit" className="admin-btn-primary" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <button 
                type="button" 
                onClick={() => { setIsResetMode(true); setError(null); setMessage(null); }} 
                style={{ background: 'none', border: 'none', color: '#6366f1', marginTop: '16px', cursor: 'pointer', width: '100%', fontSize: '14px' }}
              >
                Forgot Password?
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
