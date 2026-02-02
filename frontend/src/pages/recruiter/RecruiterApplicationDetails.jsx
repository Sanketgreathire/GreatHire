import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const RecruiterApplicationDetails = () => {
  const { jobId, candidateId } = useParams();

  const [loading, setLoading] = useState(true);
  const [candidate, setCandidate] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        setLoading(true);
        console.log('Fetching details for jobId:', jobId, 'candidateId:', candidateId);

        // 🔹 API call (example)
        const res = await axios.get(
          `/api/v1/application/details/${jobId}/${candidateId}`,
          { withCredentials: true }
        );

        console.log('API Response:', res.data);
        setCandidate(res.data.data);
      } catch (error) {
        console.error('Failed to load candidate details:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        setError(`Failed to load candidate details: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (jobId && candidateId) {
      fetchCandidateDetails();
    } else {
      setError('Missing jobId or candidateId parameters');
      setLoading(false);
    }
  }, [jobId, candidateId]);

  if (loading) {
    return <div className="p-6">Loading candidate details...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!candidate) {
    return <div className="p-6">No candidate found</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Candidate Application</h1>

      {/* 👤 Candidate Profile */}
      <div className="border rounded p-4">
        <p><strong>Name:</strong> {candidate.name}</p>
        <p><strong>Email:</strong> {candidate.email}</p>
        <p><strong>Phone:</strong> {candidate.phone}</p>
        <p><strong>Experience:</strong> {candidate.experience} years</p>
        <p><strong>Skills:</strong> {candidate.skills?.join(", ")}</p>
      </div>

      {/* 📄 Resume */}
      {candidate.resumeUrl && (
        <div className="border rounded p-4">
          <p className="font-medium mb-2">Resume</p>

          <a
            href={candidate.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View / Download Resume
          </a>
        </div>
      )}

      {/* 📌 Job Info */}
      <div className="border rounded p-4">
        <p><strong>Applied Job ID:</strong> {jobId}</p>
        <p><strong>Application Status:</strong> {candidate.status}</p>
        <p><strong>Applied On:</strong> {new Date(candidate.appliedAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default RecruiterApplicationDetails;
