// client/src/pages/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import '../css/LoginPage.css';
import dunkLogo from '../assets/images/dunk-logo.png';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      navigate(user.role === 'admin' ? "/admin/dashboard" : "/home", { replace: true });
    }
  }, [user, loading, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const result = await login({ email, password });
    if (result?.success && result?.user) {
      navigate(result.user.role === 'admin' ? "/admin/dashboard" : "/home", { replace: true });
    }
  };

  return (
    <div className="vault-auth-page">
      <div className="vault-container">
        {/* Left Side: Editorial Canvas */}
        <div className="vault-canvas">
          <div className="canvas-content">
            <img src={dunkLogo} alt="Nike Dunk Logo" className="floating-logo" />
            <div className="canvas-text">
              <span className="curator-label">Lead Curator Access</span>
              <h1>The Archive <br/>Vault</h1>
              <p>Securing the most sought-after silhouettes in the digital atelier.</p>
            </div>
          </div>
          <div className="canvas-overlay"></div>
        </div>

        {/* Right Side: Minimalist Login Form */}
        <div className="vault-form-panel">
          <div className="form-inner">
            <header className="form-header">
              <h2>Identification</h2>
              <p>Please provide your credentials to enter.</p>
            </header>

            <form onSubmit={submitHandler} className="luxury-form">
              <div className="input-group">
                <input 
                  type="email" 
                  className="luxury-input" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder="Email Registry" 
                />
              </div>

              <div className="input-group">
                <input 
                  type="password" 
                  className="luxury-input" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="Access Key" 
                />
              </div>

              <button type="submit" className="vault-submit-btn" disabled={loading}>
                {loading ? <span className="loader-dots">Verifying...</span> : "Authorize Entry"}
              </button>

              <div className="vault-footer">
                <span>New to the Archive?</span>
                <Link to="/register" className="gold-link">Request Membership</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;