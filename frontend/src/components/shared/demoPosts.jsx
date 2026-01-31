
import { useState, useEffect } from "react";

// Demo posts as initial data
const demoPosts = [
  {
    id: 1,
    title: "Completed Advanced React Certification",
    content: "Excited to share that I've successfully completed the Advanced React Development certification from Meta. This intensive program covered React 18 features, performance optimization, and modern development patterns. Looking forward to applying these skills in upcoming projects!",
    postType: "achievement",
    visibility: "Public",
    date: new Date("2024-01-15"),
    user: {
      name: "Priya Sharma",
      role: "Frontend Developer",
      location: "Bangalore, India",
      avatar: "https://i.pravatar.cc/150?img=1"
    }
  },
  {
    id: 2,
    title: "Industry Insight: The Future of AI in Software Development",
    content: "After attending the AI & Tech Summit 2024, I'm convinced that AI-assisted development tools will become essential for developers. The key is not replacement, but augmentation - AI handling repetitive tasks while developers focus on creative problem-solving and architecture decisions.",
    postType: "insight",
    visibility: "Public",
    date: new Date("2024-01-12"),
    user: {
      name: "Rahul Mehta",
      role: "Senior Software Engineer",
      location: "Mumbai, India",
      avatar: "https://i.pravatar.cc/150?img=2"
    }
  },
  {
    id: 3,
    title: "Team Expansion Announcement",
    content: "We're thrilled to announce that our engineering team is expanding! We've successfully onboarded 5 new talented developers this quarter. Our focus on creating an inclusive, learning-oriented environment continues to attract top talent. Excited for what we'll build together!",
    postType: "opportunity",
    visibility: "Public",
    date: new Date("2024-01-10"),
    user: {
      name: "Anjali Gupta",
      role: "Engineering Manager",
      location: "Delhi, India",
      avatar: "https://i.pravatar.cc/150?img=3"
    }
  },
  {
    id: 4,
    content: "Just wrapped up an amazing mentoring session with junior developers on system design principles. It's incredible to see their growth and fresh perspectives on solving complex problems. Mentoring has become one of the most rewarding aspects of my career journey.",
    postType: "update",
    visibility: "Connections",
    date: new Date("2024-01-08"),
    user: {
      name: "Vikram Singh",
      role: "Principal Software Architect",
      location: "Hyderabad, India",
      avatar: "https://i.pravatar.cc/150?img=4"
    }
  },
  {
    id: 5,
    title: "Career Transition Success",
    content: "After 6 months of dedicated learning and preparation, I'm excited to announce my transition from manual testing to automation engineering! Special thanks to my mentors and the supportive tech community. The journey of continuous learning never stops in tech.",
    postType: "achievement",
    visibility: "Public",
    date: new Date("2024-01-05"),
    user: {
      name: "Sakshi Juwar",
      role: "Automation Test Engineer",
      location: "Pune, India",
      avatar: "https://i.pravatar.cc/150?img=5"
    }
  }
];

function CreatePostModal({ close, onPostCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [visibility, setVisibility] = useState("Public");
  const [postType, setPostType] = useState("update");
  const [isSaving, setIsSaving] = useState(false);

  const MAX_CHARS = 3000;

  const handlePost = async () => {
    if (!content && !image && !video) return;

    setIsSaving(true);

    const newPost = {
      id: Date.now(),
      title: title || null,
      content,
      image: image ? URL.createObjectURL(image) : null,
      video: video ? URL.createObjectURL(video) : null,
      visibility,
      postType,
      date: new Date().toISOString(),
      user: {
        name: "Sakshi Juwar",
        role: "MSc Computer Science Student",
        location: "Mumbai, India",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
    };

    try {
      // Get existing posts from storage
      const existingPosts = await window.storage.get('user-posts');
      const posts = existingPosts ? JSON.parse(existingPosts.value) : [];
      
      // Add new post at the beginning
      posts.unshift(newPost);
      
      // Save back to storage
      await window.storage.set('user-posts', JSON.stringify(posts));
      
      // Notify parent component
      onPostCreated(newPost);
      
      close();
    } catch (error) {
      console.error('Failed to save post:', error);
      alert('Failed to save post. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-pink-100 sticky top-0">
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
              alt="User avatar"
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
            <div className="relative">
              <img
                src={URL.createObjectURL(image)}
                className="mt-3 rounded-xl max-h-72 w-full object-cover"
                alt="Preview"
              />
              <button
                onClick={() => setImage(null)}
                className="absolute top-5 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          )}

          {video && (
            <div className="relative">
              <video controls className="mt-3 rounded-xl max-h-72 w-full">
                <source src={URL.createObjectURL(video)} />
              </video>
              <button
                onClick={() => setVideo(null)}
                className="absolute top-5 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-pink-600 transition-colors">
                <span className="text-lg">📎</span>
                <span className="text-sm font-medium">Image</span>
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
              disabled={(!content && !image && !video) || isSaving}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                (content || image || video) && !isSaving
                  ? "bg-pink-600 hover:bg-pink-700 text-white shadow-sm"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isSaving ? "Saving..." : "Document & Share"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
function PostCard({ post }) {
  const getPostTypeStyle = (type) => {
    const styles = {
      achievement: 'bg-purple-100 text-purple-700',
      project: 'bg-blue-100 text-blue-700',
      insight: 'bg-green-100 text-green-700',
      opportunity: 'bg-orange-100 text-orange-700',
      update: 'bg-pink-100 text-pink-700',
      learning: 'bg-indigo-100 text-indigo-700'
    };
    return styles[type] || 'bg-gray-100 text-gray-700';
  };

  const getPostTypeLabel = (type) => {
    const labels = {
      achievement: '🎯 Achievement',
      project: '💼 Project',
      insight: '🔍 Insight',
      opportunity: '🔎 Opportunity',
      update: '📈 Update',
      learning: '📚 Learning'
    };
    return labels[type] || '📝 Post';
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* User Info */}
      <div className="flex items-start gap-3 mb-4">
        <img
          src={post.user.avatar}
          className="w-12 h-12 rounded-full"
          alt={post.user.name}
        />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{post.user.name}</h4>
          <p className="text-sm text-gray-600">{post.user.role}</p>
          <p className="text-xs text-gray-500">{post.user.location} • {formatDate(post.date)}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPostTypeStyle(post.postType)}`}>
          {getPostTypeLabel(post.postType)}
        </span>
      </div>

      {/* Title */}
      {post.title && (
        <h3 className="font-semibold text-lg text-gray-900 mb-2">{post.title}</h3>
      )}

      {/* Content */}
      <p className="text-gray-700 whitespace-pre-wrap mb-4">{post.content}</p>

      {/* Media */}
      {post.image && (
        <img src={post.image} className="rounded-lg w-full mb-4" alt="Post image" />
      )}
      {post.video && (
        <video controls className="rounded-lg w-full mb-4">
          <source src={post.video} />
        </video>
      )}

      {/* Actions */}
      <div className="flex gap-6 pt-4 border-t border-gray-100">
        <button className="text-gray-600 hover:text-pink-600 text-sm font-medium transition-colors">
          👍 Like
        </button>
        <button className="text-gray-600 hover:text-pink-600 text-sm font-medium transition-colors">
          💬 Comment
        </button>
        <button className="text-gray-600 hover:text-pink-600 text-sm font-medium transition-colors">
          🔄 Share
        </button>
      </div>
    </div>
  );
}

export default function ProfessionalNetwork() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load posts on mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const storedPosts = await window.storage.get('user-posts');
      if (storedPosts) {
        const parsedPosts = JSON.parse(storedPosts.value);
        setPosts(parsedPosts);
      } else {
        // Initialize with demo posts if no stored posts exist
        await window.storage.set('user-posts', JSON.stringify(demoPosts));
        setPosts(demoPosts);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
      // Fallback to demo posts
      setPosts(demoPosts);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset all posts to demo data?')) {
      try {
        await window.storage.set('user-posts', JSON.stringify(demoPosts));
        setPosts(demoPosts);
      } catch (error) {
        console.error('Failed to reset posts:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-pink-600 font-semibold">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Professional Network</h1>
              <p className="text-gray-600">Document and share your professional journey</p>
            </div>
            <button
              onClick={handleReset}
              className="text-sm text-gray-500 hover:text-pink-600 transition-colors"
              title="Reset to demo posts"
            >
              🔄 Reset
            </button>
          </div>
          
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all"
          >
            ✨ Create New Post
          </button>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500 mb-4">No posts yet. Create your first post!</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-6 rounded-lg transition-all"
              >
                Create Post
              </button>
            </div>
          ) : (
            posts.map(post => <PostCard key={post.id} post={post} />)
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <CreatePostModal
            close={() => setShowModal(false)}
            onPostCreated={handlePostCreated}
          />
        )}
      </div>
    </div>
  );
}