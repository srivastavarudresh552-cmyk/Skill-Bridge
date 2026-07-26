import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listRoadmaps } from '../services/roadmapApi';

export default function Dashboard() {
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listRoadmaps()
      .then(setRoadmaps)
      .catch(() => setError('Could not load your roadmaps'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name || 'there'}</h1>
        <Link
          to="/roadmaps/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
        >
          + New Roadmap
        </Link>
      </div>

      {loading && <p className="text-gray-500">Loading your roadmaps...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && roadmaps.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500 mb-4">You don't have any roadmaps yet.</p>
          <Link to="/roadmaps/new" className="text-indigo-600 font-medium">
            Create your first roadmap →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {roadmaps.map((r) => (
          <Link
            key={r._id}
            to={`/roadmaps/${r._id}`}
            className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition"
          >
            <h2 className="font-semibold text-gray-800 mb-1">{r.targetRole}</h2>
            <p className="text-sm text-gray-500">
              {r.completedSteps}/{r.totalSteps} steps complete
            </p>
            <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
              <div
                className="bg-indigo-500 h-2 rounded-full"
                style={{
                  width: r.totalSteps ? `${(r.completedSteps / r.totalSteps) * 100}%` : '0%',
                }}
              ></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}