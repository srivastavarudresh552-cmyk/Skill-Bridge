import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRoadmap, updateProgress, deleteRoadmap } from '../services/roadmapApi';
import ProgressRing from '../components/ui/ProgressRing';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import ErrorBanner from '../components/ui/ErrorBanner';

const priorityTone = { high: 'high', medium: 'medium', low: 'low' };

function StepRow({ step, onToggle, busy }) {
  return (
    <div className="flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-gray-50">
      <button
        onClick={() => onToggle(step.stepId, step.completed)}
        disabled={busy}
        aria-label={step.completed ? 'Mark as not done' : 'Mark as done'}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          step.completed ? 'border-success-600 bg-success-600' : 'border-gray-300 hover:border-brand-400'
        }`}
      >
        {step.completed && (
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium transition-colors ${step.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
          {step.title}
        </p>
        <p className={`mt-0.5 text-sm ${step.completed ? 'text-gray-300' : 'text-gray-500'}`}>{step.description}</p>
        {step.resourceLinks?.length > 0 && (
          <a
            href={step.resourceLinks[0]}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            Resource
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

export default function RoadmapDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toggleError, setToggleError] = useState('');
  const [busyStep, setBusyStep] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getRoadmap(id)
      .then(setRoadmap)
      .catch((err) => {
        if (err.response?.status === 404) setError('This roadmap could not be found.');
        else if (err.response?.status === 403) setError('This roadmap does not belong to your account.');
        else setError('Could not load this roadmap. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const toggleStep = async (stepId, currentValue) => {
    setBusyStep(stepId);
    setToggleError('');
    try {
      const updated = await updateProgress(id, stepId, !currentValue);
      setRoadmap(updated);
    } catch {
      setToggleError('Could not save that change. Check your connection and try again.');
    } finally {
      setBusyStep(null);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this roadmap? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await deleteRoadmap(id);
      navigate('/dashboard');
    } catch {
      setDeleting(false);
      setToggleError('Could not delete this roadmap. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="mx-auto max-w-lg px-5 py-16">
        <EmptyState
          icon="⚠️"
          title="Roadmap not found"
          description={error || 'This roadmap may have been deleted.'}
          action={<Link to="/dashboard" className="btn-secondary">Back to Dashboard</Link>}
        />
      </div>
    );
  }

  const total = roadmap.roadmapSteps.length;
  const completed = roadmap.roadmapSteps.filter((s) => s.completed).length;
  const pct = total ? Math.round((completed / total) * 100) : 0;
  const sortedSteps = [...roadmap.roadmapSteps].sort((a, b) => a.order - b.order);

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <Link to="/dashboard" className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
        ← Back to Dashboard
      </Link>

      <div className="card animate-fade-in-up mb-6 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{roadmap.targetRole}</h1>
          <p className="mt-1 text-sm text-gray-500">{completed} of {total} steps complete</p>
        </div>
        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <ProgressRing percent={pct} />
          <button onClick={handleDelete} disabled={deleting} className="btn-danger-ghost">
            {deleting ? <Spinner size="sm" /> : 'Delete'}
          </button>
        </div>
      </div>

      {toggleError && <ErrorBanner>{toggleError}</ErrorBanner>}

      <div className="card animate-fade-in-up mb-6 p-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Matched Skills</h2>
        <div className="flex flex-wrap gap-2">
          {roadmap.matchedSkills.length > 0 ? (
            roadmap.matchedSkills.map((skill, i) => <Badge key={i} tone="success">{skill}</Badge>)
          ) : (
            <p className="text-sm text-gray-400">No strong matches found — that's okay, your roadmap covers what to build.</p>
          )}
        </div>
      </div>

      <div className="card animate-fade-in-up mb-6 p-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Gap Skills</h2>
        <div className="space-y-3">
          {roadmap.gapSkills.map((gap, i) => (
            <div key={i} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <Badge tone={priorityTone[gap.priority] || 'low'}>{gap.priority}</Badge>
              <span className="font-medium text-gray-800">{gap.skill}</span>
              <span className="text-sm text-gray-500">— {gap.reason}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card animate-fade-in-up p-6">
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-400">Your Roadmap</h2>
        <div className="mt-3 divide-y divide-gray-50">
          {sortedSteps.map((step) => (
            <StepRow key={step.stepId} step={step} onToggle={toggleStep} busy={busyStep === step.stepId} />
          ))}
        </div>
      </div>
    </div>
  );
}