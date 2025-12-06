// import React from "react";
// import toast from "react-hot-toast";
// import {
//   FaWhatsapp,
//   FaFacebook,
//   FaTwitter,
//   FaLinkedin,
//   FaInstagram,
//   FaLink,
// } from "react-icons/fa";


// const ShareCard = ({ urlToShare, jobTitle, jobLocation, jobSalary, jobDuration, jobType, onClose }) => {
//   // Professional job message with better formatting
//   const jobMessage = `━━━━━━━━━━━━━━━━━━━━━━━━━━
//    JOB OPPORTUNITY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

// Position: ${jobTitle}

// Location: ${jobLocation}
// Salary: ${jobSalary}
// Duration: ${jobDuration}
// Job Type: ${jobType}

// Apply Now:
// ${urlToShare}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Don't miss this opportunity!`;

//   const shareOptions = [
//     {
//       name: "WhatsApp",
//       icon: <FaWhatsapp size={28} className="text-green-500" />,
//       action: () => {
//         const encodedMessage = encodeURIComponent(jobMessage);
//         window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
//       }
//     },
//     {
//       name: "Facebook",
//       icon: <FaFacebook size={28} className="text-blue-600" />,
//       action: () => {
//         navigator.clipboard.writeText(jobMessage);
//         toast.success("Job details copied! Paste in Facebook");
//         window.open("https://www.facebook.com/messages/t/", "_blank");
//       },
//     },
//     {
//       name: "Twitter",
//       icon: <FaTwitter size={28} className="text-sky-500" />,
//       action: () => {
//         const tweetMessage = `🎯 ${jobTitle}\n📍 ${jobLocation}\n💰 ${jobSalary}\n\nApply: ${urlToShare}`;
//         navigator.clipboard.writeText(tweetMessage);
//         toast.success("Job details copied! Paste in Twitter");
//         window.open("https://twitter.com/compose/tweet", "_blank");
//       },
//     },
//     {
//       name: "LinkedIn",
//       icon: <FaLinkedin size={28} className="text-blue-700" />,
//       action: () => {
//         navigator.clipboard.writeText(jobMessage);
//         toast.success("Job details copied! Paste in LinkedIn");
//         window.open("https://www.linkedin.com/messaging/", "_blank");
//       },
//     },
//     {
//       name: "Instagram",
//       icon: <FaInstagram size={28} className="text-pink-500" />,
//       action: () => {
//         navigator.clipboard.writeText(jobMessage);
//         toast.success("Job details copied! Paste in Instagram DM");
//         window.open("https://www.instagram.com/direct/inbox/", "_blank");
//       },
//     },
//     {
//       name: "Copy Link",
//       icon: <FaLink size={28} className="text-gray-600" />,
//       action: () => {
//         navigator.clipboard.writeText(urlToShare);
//         toast.success("Link copied to clipboard!");
//       }
//     }
//   ];

//   return (
//     <div className="absolute z-50 -top-2 -right-2 w-80 bg-white border border-gray-200 shadow-2xl rounded-xl p-5">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-sm font-semibold text-gray-800">Share This Job</h3>
//         <button
//           onClick={(e) => {
//             e.preventDefault();
//             e.stopPropagation();
//             onClose();
//           }}
//           className="text-gray-400 hover:text-gray-600 text-lg font-bold transition"
//         >
//           ✕
//         </button>
//       </div>

//       {/* Job Preview */}
//       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mb-4 border border-blue-100">
//         <p className="text-xs font-semibold text-blue-900 mb-2 truncate">{jobTitle}</p>
//         <div className="space-y-1 text-xs text-gray-700">
//           <p className="truncate">📍 {jobLocation}</p>
//           <p className="truncate">💰 {jobSalary}</p>
//           <p className="truncate">⏱️ {jobDuration}</p>
//         </div>
//       </div>

//       {/* Share Icons Grid */}
//       <div className="grid grid-cols-3 gap-3">
//         {shareOptions.map((option, index) => (
//           <button
//             key={index}
//             onClick={(e) => {
//               e.preventDefault();
//               e.stopPropagation();
//               option.action();
//             }}
//             title={option.name}
//             className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
//           >
//             <div className="group-hover:scale-110 transition-transform duration-200">
//               {option.icon}
//             </div>
//             <span className="text-xs font-medium text-gray-700 mt-1 group-hover:text-blue-600 transition">
//               {option.name === "Copy Link" ? "Copy" : option.name}
//             </span>
//           </button>
//         ))}
//       </div>

//       {/* Footer */}
//       <div className="mt-4 pt-3 border-t border-gray-200">
//         <p className="text-xs text-gray-500 text-center">
//           Share this opportunity with your network! 🤝
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ShareCard;

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


const ShareCard = ({ urlToShare, jobTitle, jobLocation, jobSalary, jobDuration, jobType, onClose }) => {
  const encodedURL = encodeURIComponent(urlToShare);
  const jobMessage = `Check out this job! \n\n📌 ${jobTitle}\n📍 ${jobLocation}\n💰 Salary      : ${jobSalary}\n🕒 Duration : ${jobDuration}\n💼 Type        : ${jobType} \n\n Apply here: ${urlToShare}`;

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
        navigator.clipboard.writeText(jobMessage);
        alert("Copied job details to clipboard - Now paste it into Facebook chat!")
        window.open("https://www.facebook.com/messages/t/", "_blank");
      },
    },
    {
      name: "Twitter",
      icon: <FaTwitter size={24} className="text-sky-500" />,
      action: () => {
        navigator.clipboard.writeText(jobMessage);
        alert("Copied job details ✅ Paste it into Twitter DM!");
        window.open("https://twitter.com/messages", "_blank");
      },
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin size={24} className="text-blue-700" />,
      action: () => {
        navigator.clipboard.writeText(jobMessage);
        alert("Copied job details to clipboard - Now paste it into LinkedIn chat!")
        window.open("https://www.linkedin.com/messaging/", "_blank");
      },
    },
    {
      name: "Instagram",
      icon: <FaInstagram size={24} className="text-pink-500" />,
      action: () => {
        navigator.clipboard.writeText(jobMessage);
        alert("Copied job details to clipboard - Now paste it into Instagram chat!")
        window.open("https://www.instagram.com/direct/inbox/", "_blank");
      },
    },
  ];

  return (
    <div className="absolute z-50 -top-2 -right-2 w-64 bg-white border border-gray-200 shadow-xl rounded-lg p-4">
      {/* Close Button (top-right) */}
      <div className="flex justify-end mb-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
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