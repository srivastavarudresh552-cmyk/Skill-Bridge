import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getRoadmap,
  updateProgress,
  deleteRoadmap,
} from "../services/roadmapApi";

const priorityColor = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-gray-100 text-gray-700",
};

export default function RoadmapDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getRoadmap(id)
      .then(setRoadmap)
      .catch(() => setError("Could not load this roadmap"))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleStep = async (stepId, currentValue) => {
    const updated = await updateProgress(id, stepId, !currentValue);
    setRoadmap(updated);
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this roadmap? This cannot be undone.")) return;
    await deleteRoadmap(id);
    navigate("/dashboard");
  };

  if (loading) return <p className="p-8 text-gray-500">Loading...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;
  if (!roadmap) return null;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link
        to="/dashboard"
        className="text-indigo-600 text-sm mb-4 inline-block"
      >
        ← Back to Dashboard
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {roadmap.targetRole}
        </h1>
        <button
          onClick={handleDelete}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Delete Roadmap
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-700 mb-2">Matched Skills</h2>
        <div className="flex flex-wrap gap-2">
          {roadmap.matchedSkills.map((skill, i) => (
            <span
              key={i}
              className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-700 mb-3">Gap Skills</h2>
        <div className="space-y-2">
          {roadmap.gapSkills.map((gap, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-1 rounded ${priorityColor[gap.priority] || priorityColor.low}`}
              >
                {gap.priority?.toUpperCase()}
              </span>
              <span className="font-medium text-gray-800">{gap.skill}</span>
              <span className="text-sm text-gray-500">— {gap.reason}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="font-semibold text-gray-700 mb-3">Your Roadmap</h2>
        <div className="space-y-3">
          {[...roadmap.roadmapSteps]
            .sort((a, b) => a.order - b.order)
            .map((step) => (
              <div key={step.stepId} className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={step.completed}
                  onChange={() => toggleStep(step.stepId, step.completed)}
                  className="mt-1 h-4 w-4 text-indigo-600"
                />
                <div>
                  <p
                    className={`font-medium ${step.completed ? "line-through text-gray-400" : "text-gray-800"}`}
                  >
                    {step.title}
                  </p>
                  <p className="text-sm text-gray-500">{step.description}</p>
                  {step.resourceLinks?.length > 0 && (
                    <a
                      href={step.resourceLinks[0]}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-600"
                    >
                      Resource →
                    </a>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
