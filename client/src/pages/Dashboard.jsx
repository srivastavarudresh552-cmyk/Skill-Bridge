import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listRoadmaps } from '../services/roadmapApi';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import { timeAgo } from '../utils/formatDate';

function RoadmapCard({ roadmap }) {
  const pct = roadmap.totalSteps ? Math.round((roadmap.completedSteps / roadmap.totalSteps) * 100) : 0;
  const isComplete = roadmap.totalSteps > 0 && roadmap.completedSteps === roadmap.totalSteps;

  return (
    <Link
      to={`/roadmaps/${roadmap._id}`}
      className="card group flex flex-col p-5 transition-shadow hover:shadow-[var(--shadow-card-hover)]"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold text-gray-900 group-hover:text-brand-700">{roadmap.targetRole}</h2>
        {isComplete && (
          <span className="shrink-0 rounded-full bg-success-50 px-2 py-0.5 text-xs font-medium text-success-700">
            Complete
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-gray-400">Created {timeAgo(roadmap.createdAt)}</p>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
          <span>{roadmap.completedSteps}/{roadmap.totalSteps} steps</span>
          <span className="font-medium text-gray-700">{pct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full transition-all ${isComplete ? 'bg-success-600' : 'bg-brand-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </Link>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {[1, 2].map((i) => (
        <div key={i} className="card p-5">
          <Skeleton className="h-5 w-2/3 mb-2" />
          <Skeleton className="h-3 w-1/3 mb-5" />
          <Skeleton className="h-2 w-full" />
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listRoadmaps()
      .then(setRoadmaps)
      .catch(() => setError('Could not load your roadmaps. Please try refreshing.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="mb-7 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {user?.name?.split(' ')[0] || 'there'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {roadmaps.length > 0
              ? `You have ${roadmaps.length} roadmap${roadmaps.length > 1 ? 's' : ''} in progress.`
              : 'Let\u2019s build your first skill roadmap.'}
          </p>
        </div>
        <Link to="/roadmaps/new" className="btn-primary w-full sm:w-auto">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Roadmap
        </Link>
      </div>

      {loading && <DashboardSkeleton />}

      {!loading && error && (
        <EmptyState
          icon="⚠️"
          title="Something went wrong"
          description={error}
          action={
            <button onClick={() => window.location.reload()} className="btn-secondary">
              Retry
            </button>
          }
        />
      )}

      {!loading && !error && roadmaps.length === 0 && (
        <EmptyState
          icon="🗺️"
          title="No roadmaps yet"
          description="Upload your resume and a target job description to get your first AI-generated skill roadmap."
          action={
            <Link to="/roadmaps/new" className="btn-primary">
              Create your first roadmap
            </Link>
          }
        />
      )}

      {!loading && !error && roadmaps.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {roadmaps.map((r) => (
            <RoadmapCard key={r._id} roadmap={r} />
          ))}
        </div>
      )}
    </div>
  );
}