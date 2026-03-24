import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Share2 } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const REFERRAL_GOAL = 5;

const ReferAndBoost = () => {
  const { user } = useSelector((state) => state.auth);
  const [copied, setCopied] = useState(false);

  const referralCode = user?.referralCode || "—";
  const referralCount = user?.referralCount || 0;
  const isProfileBoosted = user?.isProfileBoosted || false;
  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: "Join GreatHire!",
      text: `Use my referral code ${referralCode} to sign up on GreatHire and kickstart your career! 🚀`,
      url: referralLink,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== "AbortError") toast.error("Share failed.");
      }
    } else {
      // Fallback: open WhatsApp
      const waUrl = `https://wa.me/?text=${encodeURIComponent(shareData.text + " " + referralLink)}`;
      window.open(waUrl, "_blank");
    }
  };

  const progressPercent = Math.min((referralCount / REFERRAL_GOAL) * 100, 100);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 mt-6">
        <div className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 space-y-8">

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Refer 5 Friends &amp; Boost Your Profile 🚀
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Share your unique referral link. When 5 friends join, your profile gets boosted to the top!
            </p>
          </div>

          {/* Boost Badge */}
          {isProfileBoosted && (
            <div className="flex items-center justify-center gap-2 bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg px-4 py-3">
              <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                ✅ Your profile is boosted!
              </span>
            </div>
          )}

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
                {REFERRAL_GOAL - referralCount} more referral{REFERRAL_GOAL - referralCount !== 1 ? "s" : ""} to unlock profile boost!
              </p>
            )}
          </div>

          {/* How it works */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-6 space-y-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">How it works</p>
            <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400 list-decimal list-inside">
              <li>Share your referral link with friends</li>
              <li>They sign up using your link or code</li>
              <li>Refer 5 friends to unlock your profile boost 🚀</li>
            </ol>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReferAndBoost;
