import { useState, useEffect } from "react";
import PostCard from "./PostCard";

const SAVED_STORAGE_KEY = "greathire_saved_posts";

export default function SavedItems() {
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVED_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const postsWithDates = parsed.map(post => ({
          ...post,
          date: new Date(post.date)
        }));
        setSavedPosts(postsWithDates);
      }
    } catch (err) {
      console.warn("Error loading saved posts:", err);
      localStorage.removeItem(SAVED_STORAGE_KEY);
      setSavedPosts([]);
    }
  }, []);

  const removeSavedPost = (index) => {
    setSavedPosts((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="border-l-4 border-pink-500 pl-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Saved Professional References</h2>
          <p className="text-gray-600">
            {savedPosts.length > 0 
              ? `You have ${savedPosts.length} saved ${savedPosts.length === 1 ? 'item' : 'items'}`
              : 'Your saved posts and references will appear here.'}
          </p>
        </div>
      </div>

      {savedPosts.length > 0 ? (
        <div className="space-y-8">
          {savedPosts.map((post, i) => (
            <PostCard 
              key={i} 
              post={post} 
              onDelete={() => removeSavedPost(i)}
              isSaved={true}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No saved items yet</h3>
          <p className="text-gray-600">Click "Save for Reference" on any post to save it here</p>
        </div>
      )}
    </div>
  );
}