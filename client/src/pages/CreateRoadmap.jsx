import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createRoadmap } from '../services/roadmapApi';
import FileDropzone from '../components/ui/FileDropzone';
import AnalyzingLoader from '../components/ui/AnalyzingLoader';
import ErrorBanner from '../components/ui/ErrorBanner';

const MIN_JD_LENGTH = 50;

export default function CreateRoadmap() {
  const [targetRole, setTargetRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileSelect = (file) => {
    if (!file) {
      setResumeFile(null);
      setFileError('');
      return;
    }
    if (file.type !== 'application/pdf') {
      setFileError('Please upload a PDF file');
      setResumeFile(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File must be under 5MB');
      setResumeFile(null);
      return;
    }
    setFileError('');
    setResumeFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!resumeFile) {
      setError('Please upload your resume as a PDF');
      return;
    }
    if (jobDescription.trim().length < MIN_JD_LENGTH) {
      setError(`Job description must be at least ${MIN_JD_LENGTH} characters`);
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
      setLoading(false);
    }
  };

  const jdCount = jobDescription.trim().length;

  return (
    <div className="mx-auto max-w-xl px-5 py-10">
      <Link to="/dashboard" className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
        ← Back to Dashboard
      </Link>

      <div className="card animate-fade-in-up p-7">
        <h1 className="mb-1 text-xl font-bold text-gray-900">Create a New Roadmap</h1>
        <p className="mb-6 text-sm text-gray-500">
          We'll compare your resume against this role and build you a personalized learning plan.
        </p>

        {loading ? (
          <AnalyzingLoader />
        ) : (
          <form onSubmit={handleSubmit}>
            <ErrorBanner>{error}</ErrorBanner>

            <label htmlFor="targetRole" className="mb-1.5 block text-sm font-medium text-gray-700">
              Target Role
            </label>
            <input
              id="targetRole"
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              required
              placeholder="e.g. Frontend Developer"
              className="input-field mb-4"
            />

            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
                Job Description
              </label>
              <span className={`text-xs ${jdCount < MIN_JD_LENGTH ? 'text-gray-400' : 'text-success-600'}`}>
                {jdCount}/{MIN_JD_LENGTH}+
              </span>
            </div>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
              rows={6}
              placeholder="Paste the job posting text here..."
              className="input-field mb-4 resize-none"
            />

            <label className="mb-1.5 block text-sm font-medium text-gray-700">Resume</label>
            <div className="mb-6">
              <FileDropzone file={resumeFile} onFileSelect={handleFileSelect} error={fileError} />
            </div>

            <button type="submit" className="btn-primary w-full">
              Generate Roadmap
            </button>
          </form>
        )}
      </div>
    </div>
  );
}