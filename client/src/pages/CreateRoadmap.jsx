import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoadmap } from '../services/roadmapApi';

export default function CreateRoadmap() {
  const [targetRole, setTargetRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      setResumeFile(null);
      return;
    }
    setError('');
    setResumeFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!resumeFile) {
      setError('Please upload your resume as a PDF');
      return;
    }
    if (jobDescription.trim().length < 50) {
      setError('Job description must be at least 50 characters');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('targetRole', targetRole);
      formData.append('jobDescription', jobDescription);

      const roadmap = await createRoadmap(formData);
      navigate(`/roadmaps/${roadmap._id}`);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create a New Roadmap</h1>

        {error && (
          <p className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">{error}</p>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing your resume against the job description...</p>
            <p className="text-gray-400 text-sm mt-1">This can take up to 15-20 seconds.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="block text-sm text-gray-600 mb-1">Target Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              required
              placeholder="e.g. Frontend Developer"
              className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <label className="block text-sm text-gray-600 mb-1">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
              rows={6}
              placeholder="Paste the job posting text here (min 50 characters)"
              className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <label className="block text-sm text-gray-600 mb-1">Resume (PDF only)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              required
              className="w-full border rounded px-3 py-2 mb-6"
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Generate Roadmap
            </button>
          </form>
        )}
      </div>
    </div>
  );
}