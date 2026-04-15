import { useState } from "react";
import EmojiPicker from "emoji-picker-react";

export default function CreatePostModal({ close, addPost }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [visibility, setVisibility] = useState("Public");
  const [postType, setPostType] = useState("update");

  const MAX_CHARS = 3000;

  const handlePost = () => {
    if (!content && !image && !video) return;

    const newPost = {
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Unique ID
      title: title || null,
      content,
      image: image ? URL.createObjectURL(image) : null,
      video: video ? URL.createObjectURL(video) : null,
      visibility,
      postType,
      date: new Date(),
      user: {
        name: "Sakshi Juwar",
        role: "MSc Computer Science Student",
        location: "Mumbai, India",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
    };

    addPost(newPost);
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-pink-100">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              Document Professional Value
            </h3>
            <p className="text-sm text-gray-600">Capture achievements, insights, and career milestones</p>
          </div>
          <button
            onClick={close}
            className="text-gray-400 hover:text-pink-600 text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-6">
            <img
              src="https://i.pravatar.cc/150?img=5"
              className="w-12 h-12 rounded-full border-2 border-pink-100"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                Sakshi Juwar
              </p>
              <p className="text-sm text-gray-600">
                MSc Computer Science Student • Mumbai
              </p>
            </div>

            {/* Visibility */}
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 hover:border-pink-300 focus:border-pink-500 focus:outline-none"
            >
              <option>Public</option>
              <option>Connections</option>
              <option>Organization</option>
            </select>
          </div>

          {/* Post Context Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Professional Context</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'achievement', label: 'Achievement/Certification', icon: '🎯' },
                { value: 'project', label: 'Project Completion', icon: '💼' },
                { value: 'insight', label: 'Industry Insight', icon: '🔍' },
                { value: 'opportunity', label: 'Hiring/Opportunity', icon: '🔎' },
                { value: 'update', label: 'Career Update', icon: '📈' },
                { value: 'learning', label: 'Key Learning', icon: '📚' }
              ].map(type => (
                <button
                  key={type.value}
                  onClick={() => setPostType(type.value)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                    postType === type.value 
                      ? 'bg-pink-100 text-pink-700 border border-pink-300' 
                      : 'bg-gray-100 text-gray-600 hover:bg-pink-50 border border-gray-200'
                  }`}
                >
                  {type.icon} {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Title (Optional)</label>
            <input
              type="text"
              placeholder="Add a professional title for your update..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-pink-500 focus:outline-none"
            />
          </div>

          {/* Content Area */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Professional Documentation</label>
            <textarea
              placeholder="Document your professional value, key insights, or career milestone..."
              value={content}
              maxLength={MAX_CHARS}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[120px] border border-gray-300 rounded-lg px-4 py-3 resize-none text-gray-900 placeholder-gray-500 focus:border-pink-500 focus:outline-none"
            />

            {/* Character Counter */}
            <div className="text-right text-xs text-gray-400 mt-2">
              {content.length}/{MAX_CHARS}
            </div>
          </div>

          {/* Media Preview */}
          {image && (
            <img
              src={URL.createObjectURL(image)}
              className="mt-3 rounded-xl max-h-72 object-cover"
            />
          )}

          {video && (
            <video controls className="mt-3 rounded-xl max-h-72 w-full">
              <source src={URL.createObjectURL(video)} />
            </video>
          )}

          {/* Emoji Picker */}
          {showEmoji && (
            <div className="mt-3">
              <EmojiPicker
                height={350}
                onEmojiClick={(e) =>
                  setContent((prev) => prev + e.emoji)
                }
              />
            </div>
          )}

          {/* Action Bar */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-pink-600 transition-colors">
                <span className="text-lg">📎</span>
                <span className="text-sm font-medium">Attachment</span>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-pink-600 transition-colors">
                <span className="text-lg">🎥</span>
                <span className="text-sm font-medium">Video</span>
                <input
                  type="file"
                  hidden
                  accept="video/*"
                  onChange={(e) => setVideo(e.target.files[0])}
                />
              </label>
            </div>

            <button
              onClick={handlePost}
              disabled={!content && !image && !video}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                content || image || video
                  ? "bg-pink-600 hover:bg-pink-700 text-white shadow-sm"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Document & Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}