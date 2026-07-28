import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';
import ErrorBanner from '../components/ui/ErrorBanner';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup, authError } = useAuth();
  const navigate = useNavigate();

  const strength = password.length === 0 ? null : password.length < 8 ? 'weak' : password.length < 12 ? 'okay' : 'strong';
  const strengthMeta = {
    weak: { label: 'Too short (min 8)', color: 'bg-danger-600', width: 'w-1/3' },
    okay: { label: 'Good', color: 'bg-warning-600', width: 'w-2/3' },
    strong: { label: 'Strong', color: 'bg-success-600', width: 'w-full' },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await signup(name, email, password);
    setLoading(false);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1 text-sm text-gray-500">Start closing your skill gaps today</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-7">
          <ErrorBanner>{authError}</ErrorBanner>

          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            autoComplete="name"
            placeholder="Jane Doe"
            className="input-field mb-4"
          />

          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="input-field mb-4"
          />

          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative mb-2">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="input-field pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-xs font-medium text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {strength && (
            <div className="mb-6">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div className={`h-full rounded-full transition-all ${strengthMeta[strength].color} ${strengthMeta[strength].width}`} />
              </div>
              <p className="mt-1 text-xs text-gray-400">{strengthMeta[strength].label}</p>
            </div>
          )}
          {!strength && <div className="mb-6" />}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Spinner size="sm" className="border-white/40 border-t-white" /> : 'Sign Up'}
          </button>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}