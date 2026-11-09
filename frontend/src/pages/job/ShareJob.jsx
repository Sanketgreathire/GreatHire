import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaLink,
  FaCheck,
} from "react-icons/fa";
import { Helmet } from "react-helmet-async";

const ShareCard = ({
  urlToShare,
  jobTitle,
  jobLocation,
  jobSalary,
  jobDuration,
  jobType,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const fallbackUrl =
    urlToShare || (typeof window !== "undefined" ? window.location.href : "");
  const jobMessage = `Check out this job! \n\n📌 ${jobTitle || "Job Opening"}\n📍 ${jobLocation || "Location"}\n💰 Salary      : ${jobSalary || "Not specified"}\n🕒 Duration : ${jobDuration || "—"}\n💼 Type        : ${jobType || "—"} \n\n Apply here: ${fallbackUrl}`;

  const copyTextToClipboard = async (text) => {
    if (!text) return false;
    let ok = false;
    // 1. Try modern clipboard API
    if (typeof navigator !== "undefined" && navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        ok = true;
      } catch (err) {
        console.warn("navigator.clipboard.writeText failed, trying fallback:", err);
      }
    }
    // 2. Fallback using execCommand
    if (!ok && typeof document !== "undefined") {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.width = "2em";
        textArea.style.height = "2em";
        textArea.style.padding = "0";
        textArea.style.border = "none";
        textArea.style.outline = "none";
        textArea.style.boxShadow = "none";
        textArea.style.background = "transparent";
        textArea.setAttribute("readonly", "");
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        textArea.setSelectionRange(0, textArea.value.length);
        ok = document.execCommand("copy");
        document.body.removeChild(textArea);
      } catch (err) {
        console.error("Fallback execCommand copy failed:", err);
      }
    }
    return ok;
  };

  const handleCopyLink = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const success = await copyTextToClipboard(fallbackUrl);
    if (success) {
      setCopied(true);
      toast.success("Job link copied to clipboard!");
      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } else {
      toast.error("Failed to copy link. Please copy the URL manually.");
    }
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: <FaWhatsapp size={22} className="text-green-500" />,
      url: `https://wa.me/?text=${encodeURIComponent(jobMessage)}`,
    },
    {
      name: "Facebook",
      icon: <FaFacebook size={22} className="text-blue-600" />,
      action: async () => {
        await copyTextToClipboard(jobMessage);
        toast.success("Job details copied! Paste it in Facebook chat.");
        window.open("https://www.facebook.com/messages/t/", "_blank");
      },
    },
    {
      name: "Twitter",
      icon: <FaTwitter size={22} className="text-sky-500" />,
      action: async () => {
        await copyTextToClipboard(jobMessage);
        toast.success("Job details copied! Paste it in Twitter DM.");
        window.open("https://twitter.com/messages", "_blank");
      },
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin size={22} className="text-blue-700" />,
      action: async () => {
        await copyTextToClipboard(jobMessage);
        toast.success("Job details copied! Paste it in LinkedIn chat.");
        window.open("https://www.linkedin.com/messaging/", "_blank");
      },
    },
    {
      name: "Instagram",
      icon: <FaInstagram size={22} className="text-pink-500" />,
      action: async () => {
        await copyTextToClipboard(jobMessage);
        toast.success("Job details copied! Paste it in Instagram chat.");
        window.open("https://www.instagram.com/direct/inbox/", "_blank");
      },
    },
  ];

  return (
    <>
      <Helmet>
        <title>Share Job Openings | Simple Social Job Sharing - GreatHire</title>
        <meta
          name="description"
          content="Share job opportunities in an instant with GreatHire’s intelligent job sharing feature. Share job information such as job, location, salary, type of job, and job duration via WhatsApp, LinkedIn, Twitter, Facebook, and Instagram, and even via copying and pasting the direct link. GreatHire is founded in Hyderabad State, India, and is one of the most contemporary hiring platforms, working on providing easy and efficient job discovery, sharing, and application."
        />
      </Helmet>

      <div className="absolute z-50 top-2 right-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-xl p-4 transition-all">
        {/* Header with Title and Close Button */}
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-100 dark:border-gray-700">
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
            Share this job
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onClose) onClose();
            }}
            aria-label="Close share dialog"
            className="text-gray-400 hover:text-gray-700 dark:hover:text-white p-1 rounded-md transition-colors leading-none text-base"
          >
            ✕
          </button>
        </div>

        {/* Grid of Icons */}
        <div className="grid grid-cols-3 gap-3">
          {shareOptions.map((option, index) =>
            option.url ? (
              <a
                key={index}
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                title={option.name}
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-all"
              >
                {option.icon}
                <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300 mt-1.5">
                  {option.name}
                </span>
              </a>
            ) : (
              <button
                key={index}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  option.action();
                }}
                title={option.name}
                className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-all cursor-pointer"
              >
                {option.icon}
                <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300 mt-1.5">
                  {option.name}
                </span>
              </button>
            )
          )}

          {/* Copy Link Option */}
          <button
            type="button"
            onClick={handleCopyLink}
            title={copied ? "Copied!" : "Copy Link"}
            className={`flex flex-col items-center justify-center p-2.5 rounded-lg border transition-all cursor-pointer ${
              copied
                ? "border-emerald-300 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:border-emerald-700 dark:text-emerald-300"
                : "border-transparent hover:border-gray-200 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/60 text-gray-700 dark:text-gray-300"
            }`}
          >
            {copied ? (
              <FaCheck size={22} className="text-emerald-600 dark:text-emerald-400" />
            ) : (
              <FaLink size={22} className="text-slate-600 dark:text-slate-300" />
            )}
            <span
              className={`text-[11px] font-medium mt-1.5 ${
                copied ? "text-emerald-700 dark:text-emerald-300 font-bold" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {copied ? "Copied!" : "Copy Link"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ShareCard;
