import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider, githubProvider, microsoftProvider } from '../config/firebase-config';
import { Github, Mail } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Automatically navigate to home if user is already logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/home');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSignIn = async (provider) => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      // Navigation is handled by the onAuthStateChanged listener
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to sign in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue to your dashboard</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="auth-buttons">
          <button
            className="auth-btn google-btn"
            onClick={() => handleSignIn(googleProvider)}
            disabled={loading}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.13v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.13C1.43 8.55 1 10.22 1 12s.43 3.45 1.13 4.93l3.71-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.13 7.07l3.71 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <button
            className="auth-btn github-btn"
            onClick={() => handleSignIn(githubProvider)}
            disabled={loading}
          >
            <Github size={20} />
            Continue with GitHub
          </button>

          <button
            className="auth-btn microsoft-btn"
            onClick={() => handleSignIn(microsoftProvider)}
            disabled={loading}
          >
            {/* Microsoft logo vector */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 21 21">
              <path fill="#f35325" d="M1 1h9v9H1z" />
              <path fill="#81bc06" d="M11 1h9v9h-9z" />
              <path fill="#05a6f0" d="M1 11h9v9H1z" />
              <path fill="#ffba08" d="M11 11h9v9h-9z" />
            </svg>
            Continue with Microsoft
          </button>
        </div>

        <div className="login-footer">
          <p>By continuing, you agree to our Terms of Service test2</p>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
    </div>
  );
};

export default Login;
