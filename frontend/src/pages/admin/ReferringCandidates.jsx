import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Users, CheckCircle, Clock, Gift } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/admin/Navbar";

const BASE_API = (import.meta.env.VITE_API_URL || "") + "/api/v1";
const API = `${BASE_API}/admin/referring-candidates`;

const MILESTONE = 25;

const ReferringCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API, { withCredentials: true });
      if (data.success) setCandidates(data.candidates);
    } catch {
      toast.error("Failed to load referring candidates.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkShared = async (userId, name) => {
    if (!window.confirm(`Mark recruiter details as shared for ${name}?`)) return;
    setMarking(userId);
    try {
      const { data } = await axios.put(`${API}/${userId}/mark-shared`, {}, { withCredentials: true });
      if (data.success) {
        toast.success("Marked as Shared.");
        setCandidates((prev) =>
          prev.map((c) => (c._id === userId ? { ...c, referral25RewardStatus: "Shared" } : c))
        );
      }
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setMarking(null);
    }
  };

  const pending = candidates.filter((c) => c.referral25RewardStatus !== "Shared").length;
  const shared  = candidates.filter((c) => c.referral25RewardStatus === "Shared").length;

  return (
    <>
      <Navbar linkName="Referring Candidates" />
      <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Gift size={24} className="text-blue-600" /> Referring Candidates
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Candidates who have completed {MILESTONE} successful referrals and are eligible for recruiter contact details.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-0 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Eligible</p>
            <p className="text-2xl font-bold text-blue-600">{candidates.length}</p>
          </Card>
          <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-0 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{pending}</p>
          </Card>
          <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-0 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400">Shared</p>
            <p className="text-2xl font-bold text-green-600">{shared}</p>
          </Card>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500">
            <Users size={48} className="mx-auto mb-3 opacity-40" />
            <p className="text-lg">No candidates have reached {MILESTONE} referrals yet.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">#</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Candidate Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Email</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Mobile</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Total Referrals</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">25th Referral Date</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Reward Status</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {candidates.map((c, idx) => (
                    <tr key={c._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{idx + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{c.fullname}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{c.emailId?.email || "—"}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{c.phoneNumber?.number || "—"}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-bold text-blue-600 dark:text-blue-400">{c.referralCount}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                        {c.referral25AchievedAt
                          ? new Date(c.referral25AchievedAt).toLocaleDateString("en-IN", {
                              day: "2-digit", month: "short", year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {c.referral25RewardStatus === "Shared" ? (
                          <Badge className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-0 gap-1">
                            <CheckCircle size={12} /> Shared
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-0 gap-1">
                            <Clock size={12} /> Pending
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {c.referral25RewardStatus !== "Shared" ? (
                          <Button
                            size="sm"
                            disabled={marking === c._id}
                            onClick={() => handleMarkShared(c._id, c.fullname)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 h-auto"
                          >
                            {marking === c._id ? (
                              <span className="flex items-center gap-1">
                                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Saving...
                              </span>
                            ) : (
                              "Mark as Shared"
                            )}
                          </Button>
                        ) : (
                          <span className="text-xs text-gray-400 dark:text-gray-500">Done</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Info note */}
        <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
          * Admin should manually contact the candidate and share 15 recruiter contact details (Name, Email, Phone). After sharing, click "Mark as Shared" to update the status.
        </p>
      </div>
    </>
  );
};

export default ReferringCandidates;
