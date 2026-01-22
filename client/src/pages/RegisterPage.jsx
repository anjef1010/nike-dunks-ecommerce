// client/src/pages/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import '../css/RegisterPage.css';
import dunkLogo from '../assets/images/dunk-logo.png';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { register, user, loading } = useAuth();
  const navigate = useNavigate();

  const { name, username, email, password, confirmPassword } = formData;

  useEffect(() => {
    if (user && !loading) {
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/home');
    }
  }, [user, loading, navigate]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Access Keys do not match');
      return;
    }

    // We only pass name, email, and password as defined in our Context function
const result = await register(name, email, password);

    if (result.success) {
      toast.success('Registry Successful. Please Authorize.');
      navigate('/login');
    } else if (result.message) {
      toast.error(result.message);
    }
  };

  return (
    <div className="vault-auth-page register-variant">
      <div className="vault-container">
        {/* Left Side: Editorial Canvas (Syncs with Login) */}
        <div className="vault-canvas">
          <div className="canvas-content">
            <img src={dunkLogo} alt="Nike Dunk Logo" className="floating-logo" />
            <div className="canvas-text">
              <span className="curator-label">Privileged Access</span>
              <h1>Join The <br/>Registry</h1>
              <p>Create your curator profile to access the most exclusive drops in the archive.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Membership Form */}
        <div className="vault-form-panel">
          <div className="form-inner">
            <header className="form-header">
              <h2>Membership</h2>
              <p>Establish your credentials below.</p>
            </header>

            <form onSubmit={onSubmit} className="luxury-form">
              <div className="input-group">
                <input 
                  type="text" 
                  name="name" 
                  className="luxury-input" 
                  placeholder="Full Legal Name" 
                  value={name} 
                  onChange={onChange} 
                  required 
                />
              </div>

              <div className="input-group">
                <input 
                  type="text" 
                  name="username" 
                  className="luxury-input" 
                  placeholder="Username Alias" 
                  value={username} 
                  onChange={onChange} 
                  required 
                />
              </div>

              <div className="input-group">
                <input 
                  type="email" 
                  name="email" 
                  className="luxury-input" 
                  placeholder="Registry Email" 
                  value={email} 
                  onChange={onChange} 
                  required 
                />
              </div>

              <div className="input-group">
                <input 
                  type="password" 
                  name="password" 
                  className="luxury-input" 
                  placeholder="Set Access Key" 
                  value={password} 
                  onChange={onChange} 
                  required 
                />
              </div>

              <div className="input-group">
                <input 
                  type="password" 
                  name="confirmPassword" 
                  className="luxury-input" 
                  placeholder="Confirm Access Key" 
                  value={confirmPassword} 
                  onChange={onChange} 
                  required 
                />
              </div>

              <button type="submit" className="vault-submit-btn" disabled={loading}>
                {loading ? "Registering..." : "Submit Registry"}
              </button>

              <div className="vault-footer">
                <span>Already a Member?</span>
                <Link to="/login" className="gold-link">Authorize Entry</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;