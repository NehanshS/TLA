import { useEffect, useState } from "react";

const MOCK_METRICS = {
  clearance: 91,
  equipment: 157,
  circulation: 78,
  layoutScore: 87,
  euiScore: 42,
  estimatedWorkers: 320,
};

export default function useSpeckleData(streamId) {
  const [data, setData] = useState({
    projectName: "",
    updatedAt: "",
    commitCount: 0,
    metrics: MOCK_METRICS,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStream = async () => {
    if (!streamId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://latest.speckle.dev/api/streams/${streamId}`);
      if (!response.ok) throw new Error("Speckle stream not found or API error");
      const json = await response.json();
      setData({
        projectName: json.stream.name,
        updatedAt: json.stream.updatedAt,
        commitCount: json.stream.commits.totalCount,
        metrics: MOCK_METRICS, // Always return mock metrics for now, ready to swap for real metrics
      });
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStream();
    const interval = setInterval(fetchStream, 15000);
    return () => clearInterval(interval);
  }, [streamId]);

  return { ...data, loading, error };
}
