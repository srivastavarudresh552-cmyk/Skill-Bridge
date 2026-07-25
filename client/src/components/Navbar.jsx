import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      <Link to="/" className="text-xl font-bold text-indigo-600">SkillBridge</Link>
      <div className="flex items-center gap-4 text-sm text-gray-600">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={logout} className="text-gray-500 hover:text-gray-800">Log Out</button>
          </>
        ) : (
          <>
            <Link to="/login">Log In</Link>
            <Link to="/signup" className="text-indigo-600 font-medium">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}