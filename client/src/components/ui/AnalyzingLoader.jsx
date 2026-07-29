import { useEffect, useState } from 'react';
import Spinner from './Spinner';

const messages = [
  'Reading your resume...',
  'Comparing it against the job description...',
  'Identifying your matched skills...',
  'Finding the skill gaps...',
  'Building your step-by-step roadmap...',
];

export default function AnalyzingLoader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1 < messages.length ? i + 1 : i));
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center py-12 text-center">
      <Spinner size="lg" />
      <p className="mt-5 font-medium text-gray-800">{messages[index]}</p>
      <p className="mt-1.5 text-sm text-gray-400">This usually takes 15-20 seconds</p>
    </div>
  );
}