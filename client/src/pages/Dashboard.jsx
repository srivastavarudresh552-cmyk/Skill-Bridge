import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.name || 'there'}
        </h1>
        <button
          onClick={logout}
          className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded"
        >
          Log Out
        </button>
      </div>
      <p className="text-gray-500">Your roadmaps will appear here — coming Day 5.</p>
    </div>
  );
}