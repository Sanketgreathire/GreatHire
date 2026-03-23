import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { FiCopy, FiCheck, FiGift, FiBriefcase, FiShare2 } from "react-icons/fi";
import { Helmet } from "react-helmet-async";

const InviteAndEarn = () => {
  const { user } = useSelector((state) => state.auth);
  const [copied, setCopied] = useState(false);

  const referralCode = user?.referralCode || "—";
  const remainingJobPosts = user?.remainingJobPosts ?? 0;
  const candidateReferralsCount = user?.candidateReferralsCount ?? 0;
  const REFERRAL_GOAL = 15;
  const referralsLeft = REFERRAL_GOAL - candidateReferralsCount;
  const progressPercent = Math.round((candidateReferralsCount / REFERRAL_GOAL) * 100);
  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join GreatHire",
          text: "Sign up on GreatHire using my referral link and help me earn a free job post!",
          url: referralLink,
        });
      } catch (_) {}
    } else {
      handleCopy();
    }
  };

  const steps = [
    { icon: "🔗", title: "Share your link", desc: "Send your unique referral link to candidates." },
    { icon: "✅", title: "They sign up", desc: "Candidate registers using your referral link." },
    { icon: "📝", title: "They complete profile", desc: "Candidate fills in their full profile." },
    { icon: "🎁", title: "You earn +1 job post", desc: "Every 15 completed profiles earns you 1 free job post." },
  ];

  return (
    <>
      <Helmet>
        <title>Invite & Earn | GreatHire Recruiter Dashboard</title>
        <meta name="description" content="Invite candidates and earn free job posts on GreatHire." />
      </Helmet>

      <div className="min-h-screen p-6 pt-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">
              🎁 Invite &amp; Earn
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Refer candidates to GreatHire. Each one who completes their profile earns you a free job post.
            </p>
          </div>

          {/* Reward Counter */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">Remaining Job Posts</p>
                <p className="text-5xl font-extrabold mt-1">{remainingJobPosts}</p>
                <p className="text-xs opacity-70 mt-1">🎁 Includes bonus posts earned from referrals</p>
              </div>
              <FiBriefcase size={56} className="opacity-30" />
            </div>

            {/* Referral Progress */}
            <div className="bg-white/10 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">Referral Goal Progress</span>
                <span className="font-bold">{candidateReferralsCount} / {REFERRAL_GOAL}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2.5">
                <div
                  className="bg-white rounded-full h-2.5 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs opacity-80">
                {referralsLeft > 0
                  ? `🎯 ${referralsLeft} more referral${referralsLeft > 1 ? "s" : ""} needed to earn your next free job post`
                  : "🎉 Goal reached! Your free job post has been credited."}
              </p>
            </div>
          </div>

          {/* Referral Code */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 space-y-3 border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Your Referral Code
            </p>
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3">
              <span className="text-2xl font-bold tracking-widest text-blue-600 dark:text-blue-400 flex-1">
                {referralCode}
              </span>
            </div>

            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide pt-1">
              Your Referral Link
            </p>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={referralLink}
                className="flex-1 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-gray-700 dark:text-gray-300 truncate focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap"
              >
                {copied ? <FiCheck size={15} /> : <FiCopy size={15} />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap"
              >
                <FiShare2 size={15} />
                Share
              </button>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 border border-gray-100 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
              <FiGift className="text-blue-500" /> How it works
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"
                >
                  <span className="text-2xl">{step.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{step.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          <p className="text-xs text-center text-gray-400 dark:text-gray-500">
            Each candidate can only trigger the reward once. Every 15 referrals earns you 1 free job post, consumed automatically when you post a job.
          </p>
        </div>
      </div>
    </>
  );
};

export default InviteAndEarn;
