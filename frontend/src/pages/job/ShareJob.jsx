import React from "react";
import toast from "react-hot-toast";
import {
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  //  FaEnvelope,
  FaLink,
} from "react-icons/fa";



const ShareCard = ({ urlToShare, onClose }) => {
  const encodedURL = encodeURIComponent(urlToShare);

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: <FaWhatsapp size={24} className="text-green-500" />,
      url: `https://wa.me/?text=${encodeURIComponent("Check out this job!\n\n" + "https://" + urlToShare.replace(/^https?:\/\//, ""))}`,
      // url: `https://wa.me/?text=${encodeURIComponent("Check this out!\nhttps://www.google.com")}`,
      //url: `https://wa.me/?text=${encodedURL}`,
    },
    {
      name: "Facebook",
      icon: <FaFacebook size={24} className="text-blue-600" />,
      //url: `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      "https://" + urlToShare.replace(/^https?:\/\//, "")
    )}`,
    },
    {
      name: "Twitter",
      icon: <FaTwitter size={24} className="text-sky-500" />,
      //url: `https://twitter.com/intent/tweet?url=${encodedURL}`,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      "Check out this job! "
    )}&url=${encodeURIComponent("https://" + urlToShare.replace(/^https?:\/\//, ""))}`,
  
    },
    // {
    //   name: "Email",
    //   icon: <FaEnvelope size={24} className="text-yellow-600" />,
    //   url: `mailto:?body=${encodedURL}`,
    // },
    {
      name: "LinkedIn",
      icon: <FaLinkedin size={24} className="text-blue-700" />,
      //url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedURL}`,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      "https://" + urlToShare.replace(/^https?:\/\//, "")
    )}`,
    },
    {
      name: "Instagram",
      icon: <FaInstagram size={24} className="text-pink-500" />,
      url: `https://www.instagram.com/`, // No direct sharing
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(urlToShare);
    toast.success("Link copied to clipboard!");
    //alert("Link copied to clipboard!");
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
        {shareOptions.map((option, index) => (
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
        ))}

        {/* Copy Link */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            copyToClipboard();
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
