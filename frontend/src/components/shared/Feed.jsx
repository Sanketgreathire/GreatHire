import { useEffect, useState } from "react";
import CreatePostModal from "./CreatePostModal";
import PostCard from "./PostCard";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import SavedItems from "./SavedItems";
import Groups from "./Groups";
import Newsletters from "./Newsletters";
import Events from "./Events";
import CareerPulse from "./CareerPulse";
import demoPosts from "./demoPosts";

const STORAGE_KEY = "greathire_posts";

export default function Feed() {
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [activeSection, setActiveSection] = useState("feed");
  const [refreshSaved, setRefreshSaved] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        const postsWithDates = parsed.map(post => ({
          ...post,
          date: new Date(post.date)
        }));
        setPosts(postsWithDates);
      } else {
        setPosts(demoPosts);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(demoPosts));
      }
    } catch (err) {
      console.warn("Corrupted localStorage — resetting posts");
      localStorage.removeItem(STORAGE_KEY);
      setPosts(demoPosts);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoPosts));
    }
  }, []);

  useEffect(() => {
    if (Array.isArray(posts) && posts.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    }
  }, [posts]);

  const addPost = (post) => {
    setPosts((prev) => [post, ...prev]);
  };

  const deletePost = (index) => {
    setPosts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveRefresh = () => {
    setRefreshSaved(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4">

        {/* Left */}
        <div className="hidden md:block">
          <LeftSidebar onSelect={setActiveSection} />
        </div>

        {/* Professional Activity Stream */}
        <div className="md:col-span-2 space-y-8">

          {activeSection === "feed" && (
            <>
              {/* Professional Update Composer */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="border-l-4 border-pink-500 pl-6 mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Activity Stream</h3>
                  <p className="text-gray-600">Share career updates, insights, and professional announcements</p>
                </div>
                
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full text-left border border-gray-300 rounded-lg px-6 py-4 text-gray-700 hover:border-pink-300 hover:bg-pink-50 transition-all duration-200 mb-6 font-medium"
                >
                  Document a professional milestone or share insights...
                </button>

                <div className="grid grid-cols-3 gap-3">
                  <button className="flex items-center justify-center py-3 px-4 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors border border-gray-200 hover:border-pink-200">
                    <span className="mr-2 text-sm">🎯</span>
                    <span className="text-sm font-medium">Achievement</span>
                  </button>
                  <button className="flex items-center justify-center py-3 px-4 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors border border-gray-200 hover:border-pink-200">
                    <span className="mr-2 text-sm">💼</span>
                    <span className="text-sm font-medium">Project Update</span>
                  </button>
                  <button className="flex items-center justify-center py-3 px-4 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors border border-gray-200 hover:border-pink-200">
                    <span className="mr-2 text-sm">🔍</span>
                    <span className="text-sm font-medium">Industry Insight</span>
                  </button>
                </div>
              </div>

              {showModal && (
                <CreatePostModal
                  close={() => setShowModal(false)}
                  addPost={addPost}
                />
              )}

              {/* Posts */}
              <div className="space-y-8">
                {posts.map((post, i) => (
                  <PostCard 
                    key={post.id || i} 
                    post={post} 
                    onDelete={() => deletePost(i)}
                    onSaveSuccess={handleSaveRefresh}
                  />
                ))}
              </div>
            </>
          )}

          {activeSection === "saved" && <SavedItems key={refreshSaved} />}
          {activeSection === "groups" && <Groups />}
          {activeSection === "newsletters" && <Newsletters />}
          {activeSection === "events" && <Events />}
          {activeSection === "career" && <CareerPulse />}
        </div>

        {/* Right */}
        <div className="hidden md:block">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}