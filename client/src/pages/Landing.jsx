import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Landing() {
  const [status, setStatus] = useState('checking...');

  useEffect(() => {
    api.get('/health')
      .then((res) => setStatus(res.data.message))
      .catch(() => setStatus('Backend not reachable'));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-indigo-600">SkillBridge</h1>
      <p className="text-gray-600">Know your gap. Close it with a plan.</p>
      <p className="text-sm text-gray-400">Backend status: {status}</p>
    </div>
  );
}