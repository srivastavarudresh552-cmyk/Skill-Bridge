import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SessionExpiredModal() {
  const { sessionExpired, dismissSessionExpired } = useAuth();
  const navigate = useNavigate();

  if (!sessionExpired) return null;

  const handleClose = () => {
    dismissSessionExpired();
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="card animate-fade-in-up w-full max-w-sm p-6 text-center">
        <span className="text-3xl">⏱️</span>
        <h2 className="mt-3 text-lg font-bold text-gray-900">Session expired</h2>
        <p className="mt-1.5 text-sm text-gray-500">Please log in again to continue.</p>
        <button onClick={handleClose} className="btn-primary mt-5 w-full">
          Go to Login
        </button>
      </div>
    </div>
  );
}