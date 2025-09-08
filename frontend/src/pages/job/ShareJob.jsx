import React from "react";
import toast from "react-hot-toast";
import {
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaLink,
} from "react-icons/fa";


const ShareCard = ({ urlToShare, jobTitle, jobLocation,jobSalary,jobDuration,jobType, onClose }) => {
  const encodedURL = encodeURIComponent(urlToShare);
  const jobMessage = `Check out this job! \n\n📌 ${jobTitle}\n📍 ${jobLocation}\n💰 Salary      : ${jobSalary}\n🕒 Duration : ${jobDuration}\n💼 Type        : ${jobType} \n\n Apply here: ${urlToShare}`; // ✅ Job message string


  const shareOptions = [
    {
      name: "WhatsApp",
      icon: <FaWhatsapp size={24} className="text-green-500" />,
      url: `https://wa.me/?text=${encodeURIComponent(jobMessage)}`
    },
    {
      name: "Facebook",
      icon: <FaFacebook size={24} className="text-blue-600" />,
      action: () => {
        // Copy job link
        navigator.clipboard.writeText(jobMessage);
        //toast.success("Job link copied! 🚀");
        alert("Copied job details to clipboard - Now paste it into Facebook chat!")

        // Open Messenger directly
        window.open("https://www.facebook.com/messages/t/", "_blank");
      },
    },
    {
      name: "Twitter",
      icon: <FaTwitter size={24} className="text-sky-500" />,
      action: () => {
        navigator.clipboard.writeText(jobMessage);   // Copy full job details
        alert("Copied job details ✅ Paste it into Twitter DM!");
        window.open("https://twitter.com/messages", "_blank");    // Open Twitter Direct Messages
      },
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin size={24} className="text-blue-700" />,
      action: () => {
        navigator.clipboard.writeText(jobMessage);
        //toast.success("Copied! Paste into LinkedIn chat 🚀");
        alert("Copied job details to clipboard - Now paste it into LinkedIn chat!")
        window.open("https://www.linkedin.com/messaging/", "_blank");
      },
    },
    {
      name: "Instagram",
      icon: <FaInstagram size={24} className="text-pink-500" />,
      action: () => {
        navigator.clipboard.writeText(jobMessage);
        //toast.success("Copied! Paste into LinkedIn chat 🚀");
        alert("Copied job details to clipboard - Now paste it into Instagram chat!")
        window.open("https://www.instagram.com/direct/inbox/", "_blank");
      },
    },

  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(urlToShare);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="absolute z-50 top-full right-0 mt-2 w-64 bg-white border border-gray-200 shadow-xl rounded-lg p-4">
      {/* Close Button (top-right) */}
      <div className="flex justify-end mb-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation(); // ✅ prevents card click event
            onClose();
          }}
          className="text-gray-400 hover:text-black text-sm font-semibold"
        >
          ✕
        </button>
      </div>

      {/* Grid of Icons */}
      <div className="grid grid-cols-3 gap-4">
        {shareOptions.map((option, index) =>
          option.url ? (
            <a
              key={index}
              href={option.url}
              target="_blank"
              rel="noopener noreferrer"
              title={option.name}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center justify-center hover:opacity-80 transition"
            >
              {option.icon}
            </a>
          ) : (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                option.action();
              }}
              title={option.name}
              className="flex flex-col items-center justify-center hover:opacity-80 transition"
            >
              {option.icon}
            </button>
          )
        )}

        {/* Copy Link Option */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigator.clipboard.writeText(urlToShare);
            toast.success("Link copied to clipboard!");
          }}
          title="Copy Link"
          className="flex flex-col items-center justify-center hover:opacity-80 transition"
        >
          <FaLink size={24} className="text-gray-600" />
        </button>
      </div>

    </div>
  );
};

export default ShareCard;
