import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const steps = [
  {
    title: 'Upload your resume',
    description: 'Drop in your resume as a PDF — that\u2019s all we need to get started.',
    icon: '📄',
  },
  {
    title: 'Tell us your target role',
    description: 'Paste the job description you\u2019re aiming for.',
    icon: '🎯',
  },
  {
    title: 'Get your roadmap',
    description: 'AI compares the two and builds a step-by-step plan to close the gap.',
    icon: '🗺️',
  },
];

export default function Landing() {
  const { user } = useAuth();
  const [apiReady, setApiReady] = useState(null);

  useEffect(() => {
    api
      .get('/health')
      .then(() => setApiReady(true))
      .catch(() => setApiReady(false));
  }, []);

  return (
    <div>
      <section className="mx-auto max-w-4xl px-5 pt-16 pb-14 text-center sm:pt-24 sm:pb-20">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
          {apiReady === null ? 'Connecting…' : apiReady ? '● Service online' : '● Service waking up'}
        </span>

        <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Know your gap.<br />
          <span className="text-brand-600">Close it with a plan.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base text-gray-500 sm:text-lg">
          Upload your resume and a target job description — SkillBridge uses AI to find exactly
          which skills you're missing and builds you a step-by-step roadmap to close the gap.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to={user ? '/dashboard' : '/signup'} className="btn-primary w-full sm:w-auto !px-6 !py-3 text-base">
            {user ? 'Go to Dashboard' : 'Get Started — it\u2019s free'}
          </Link>
          {!user && (
            <Link to="/login" className="btn-secondary w-full sm:w-auto !px-6 !py-3 text-base">
              I already have an account
            </Link>
          )}
        </div>
      </section>

      <section className="border-t border-gray-100 bg-white py-14">
        <div className="mx-auto max-w-4xl px-5">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-gray-400">
            How it works
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div key={i} className="card animate-fade-in-up p-6 text-center" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="mb-3 text-3xl">{step.icon}</div>
                <h3 className="font-semibold text-gray-800">{step.title}</h3>
                <p className="mt-1.5 text-sm text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}