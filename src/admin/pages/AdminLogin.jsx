import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/admin.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
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

  return (
    <div className="admin-app">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <img src="/logo.svg" alt="LearnDepth" className="admin-login-logo" onError={(e) => e.target.style.display = 'none'} />
          <h2>Admin Portal</h2>
          <p>Sign in to manage LearnDepth</p>

          {error && <div className="admin-error-alert">{error}</div>}

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
          </form>
        </div>
      </div>
    </div>
  );
}
