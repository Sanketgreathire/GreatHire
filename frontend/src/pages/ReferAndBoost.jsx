import React, { useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Share2 } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const REFERRAL_GOAL = 25;

const ReferAndBoost = () => {
  const { user } = useSelector((state) => state.auth);
  const [copied, setCopied] = useState(false);

  const referralCode = user?.referralCode || "—";
  const referralCount = user?.referralCount || 0;
  const isProfileBoosted = user?.isProfileBoosted || false;
  const recruiterRewardEligible = !!user?.referral25AchievedAt;

  const { referralLink, progressPercent, remaining } = useMemo(() => ({
    referralLink: `${window.location.origin}/signup?ref=${referralCode}`,
    progressPercent: Math.min((referralCount / REFERRAL_GOAL) * 100, 100),
    remaining: Math.max(REFERRAL_GOAL - referralCount, 0),
  }), [referralCode, referralCount]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2500);
    });
  }, [referralLink]);

  const handleShare = useCallback(async () => {
    const text = `Use my referral code ${referralCode} to sign up on GreatHire and kickstart your career! 🚀`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Join GreatHire!", text, url: referralLink });
      } catch (err) {
        if (err.name !== "AbortError") toast.error("Share failed.");
      }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + referralLink)}`, "_blank");
    }
  }, [referralCode, referralLink]);

  const allUnlocked = isProfileBoosted && recruiterRewardEligible;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 mt-6">
        <div className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 space-y-8">

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Refer 25 Friends &amp; Unlock Rewards 🚀
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Share your unique referral link. When 25 friends join, you unlock two exclusive rewards!
            </p>
          </div>

          {/* Rewards unlocked banner */}
          {allUnlocked && (
            <div className="flex flex-col gap-2 bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg px-4 py-3">
              <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                🎉 All rewards unlocked! Congratulations!
              </span>
            </div>
          )}

          {/* Reward Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-xl border p-4 text-center space-y-1 transition-colors ${
              isProfileBoosted
                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700"
                : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            }`}>
              <div className="text-2xl">{isProfileBoosted ? "✅" : "🔒"}</div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Profile Boost</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Top Priority in recruitment</p>
              {isProfileBoosted && (
                <span className="inline-block text-xs text-blue-600 dark:text-blue-400 font-medium">Unlocked!</span>
              )}
            </div>

            <div className={`rounded-xl border p-4 text-center space-y-1 transition-colors ${
              recruiterRewardEligible
                ? "bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700"
                : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            }`}>
              <div className="text-2xl">{recruiterRewardEligible ? "✅" : "🔒"}</div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Recruiter Contacts</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Get 15 recruiter details</p>
              {recruiterRewardEligible ? (
                <span className="inline-block text-xs text-purple-600 dark:text-purple-400 font-medium">Eligible! Admin will contact you.</span>
              ) : null}
            </div>
          </div>

          {/* Referral Code */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Your Referral Code
            </p>
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3">
              <span className="text-xl font-bold tracking-widest text-blue-600 dark:text-blue-400 flex-1">
                {referralCode}
              </span>
            </div>
          </div>

          {/* Referral Link + Copy */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Your Referral Link
            </p>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={referralLink}
                className="flex-1 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-gray-700 dark:text-gray-300 truncate focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                {copied ? "Copied ✓" : "Copy Link"}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                <Share2 size={15} />
                Share
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Progress</span>
              <span>{referralCount} / {REFERRAL_GOAL} friends joined</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {referralCount < REFERRAL_GOAL && (
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                {remaining} more referral{remaining !== 1 ? "s" : ""} to unlock all rewards!
              </p>
            )}
          </div>

          {/* How it works */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-6 space-y-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">How it works</p>
            <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400 list-decimal list-inside">
              <li>Share your referral link with friends</li>
              <li>They sign up using your link or code</li>
              <li>Refer 25 friends to unlock your profile boost 🚀</li>
              <li>Also get 15 recruiter contact details shared by admin 🎁</li>
            </ol>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReferAndBoost;
