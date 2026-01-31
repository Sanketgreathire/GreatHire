import { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";

const SAVED_STORAGE_KEY = "greathire_saved_posts";

// Comment Component with nested replies
function Comment({ comment, postId, level = 0 }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [liked, setLiked] = useState(comment.liked || false);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const [showReplies, setShowReplies] = useState(true);

  const handleLike = () => {
    const newLiked = !liked;
    const newCount = newLiked ? likeCount + 1 : likeCount - 1;
    setLiked(newLiked);
    setLikeCount(newCount);
    comment.liked = newLiked;
    comment.likeCount = newCount;
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    
    const newReply = {
      id: Date.now() + Math.random(),
      text: replyText,
      time: new Date(),
      liked: false,
      likeCount: 0,
      replies: []
    };

    if (!comment.replies) comment.replies = [];
    comment.replies.unshift(newReply);
    
    setReplyText("");
    setShowReplyBox(false);
  };

  return (
    <div className={`${level > 0 ? 'ml-11' : ''}`}>
      <div className="flex gap-3 mb-3">
        <img
          src="https://i.pravatar.cc/150?img=1"
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1">
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900 text-sm">You</span>
              <span className="text-xs text-gray-500">
                {new Date(comment.time).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-800">{comment.text}</p>
          </div>
          
          {/* Like and Reply buttons */}
          <div className="flex items-center gap-4 mt-2 ml-1">
            <button
              onClick={handleLike}
              className={`text-xs font-medium ${
                liked ? 'text-pink-600' : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              👍 Like {likeCount > 0 && `(${likeCount})`}
            </button>
            <button
              onClick={() => setShowReplyBox(!showReplyBox)}
              className="text-xs font-medium text-gray-600 hover:text-pink-600"
            >
              💬 Reply
            </button>
            {comment.replies && comment.replies.length > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-xs font-medium text-gray-600 hover:text-pink-600"
              >
                {showReplies ? '▼' : '▶'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
              </button>
            )}
          </div>

          {/* Reply Input Box */}
          {showReplyBox && (
            <div className="flex gap-2 mt-3">
              <img
                src="https://i.pravatar.cc/150?img=1"
                className="w-7 h-7 rounded-full"
              />
              <div className="flex-1 flex gap-2">
                <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:border-pink-500 focus:outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleReply()}
                />
                <button
                  onClick={handleReply}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                >
                  Reply
                </button>
              </div>
            </div>
          )}

          {/* Nested Replies */}
          {showReplies && comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.map((reply) => (
                <Comment
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PostCard({ post, onDelete, isSaved = false, onSaveSuccess }) {
  // Generate unique ID using content hash + date
  const generatePostId = (post) => {
    if (post.id) return post.id;
    const str = `${post.content}_${post.user?.name}_${new Date(post.date).getTime()}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `post_${Math.abs(hash)}`;
  };

  const postId = generatePostId(post);

  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [saved, setSaved] = useState(false);

  /* -------------------- LOAD STATE -------------------- */
  useEffect(() => {
    const storedLikes = localStorage.getItem(`likes_${postId}`);
    const storedComments = localStorage.getItem(`comments_${postId}`);
    const savedPosts = localStorage.getItem(SAVED_STORAGE_KEY);

    if (storedLikes) {
      try {
        const parsed = JSON.parse(storedLikes);
        setLikes(parsed.count || 0);
        setLiked(parsed.liked || false);
      } catch (e) {
        console.error("Error parsing likes:", e);
      }
    }
    
    if (storedComments) {
      try {
        const parsed = JSON.parse(storedComments);
        setComments(parsed);
      } catch (e) {
        console.error("Error parsing comments:", e);
        setComments([]);
      }
    }

    // Check if post is saved
    if (savedPosts) {
      try {
        const parsed = JSON.parse(savedPosts);
        const isPostSaved = parsed.some((p) => {
          const postDate = new Date(p.date).getTime();
          const currentDate = new Date(post.date).getTime();
          return postDate === currentDate && p.content === post.content;
        });
        setSaved(isPostSaved || isSaved);
      } catch (e) {
        console.error("Error parsing saved posts:", e);
      }
    }
  }, [postId, post.date, post.content, isSaved]);

  /* -------------------- SAVE COMMENTS -------------------- */
  useEffect(() => {
    if (comments.length > 0) {
      localStorage.setItem(`comments_${postId}`, JSON.stringify(comments));
    }
  }, [comments, postId]);

  /* -------------------- LIKE -------------------- */
  const toggleLike = () => {
    const newLiked = !liked;
    const newLikes = newLiked ? likes + 1 : likes - 1;

    setLiked(newLiked);
    setLikes(newLikes);

    localStorage.setItem(
      `likes_${postId}`,
      JSON.stringify({ liked: newLiked, count: newLikes })
    );
  };

  /* -------------------- COMMENT -------------------- */
  const addComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now() + Math.random(),
      text: commentText,
      time: new Date(),
      liked: false,
      likeCount: 0,
      replies: []
    };

    const updated = [newComment, ...comments];

    setComments(updated);
    setCommentText("");
  };

  /* -------------------- SHARE -------------------- */
  const sharePost = async () => {
    try {
      await navigator.clipboard.writeText(post.content);
      alert("Post copied to clipboard!");
    } catch {
      alert("Copy failed");
    }
  };

  /* -------------------- SAVE POST -------------------- */
  const handleSavePost = () => {
    try {
      const saved = localStorage.getItem(SAVED_STORAGE_KEY);
      const savedPosts = saved ? JSON.parse(saved) : [];
      
      // Check if post is already saved
      const isAlreadySaved = savedPosts.some((savedPost) => {
        const savedDate = new Date(savedPost.date).getTime();
        const currentDate = new Date(post.date).getTime();
        return savedDate === currentDate && savedPost.content === post.content;
      });
      
      if (isAlreadySaved) {
        alert("This post is already saved!");
        setShowMenu(false);
        return;
      }
      
      // Add post to saved items
      const updatedSaved = [post, ...savedPosts];
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(updatedSaved));
      setSaved(true);
      alert("Post saved successfully!");
      setShowMenu(false);
      
      // Trigger refresh in SavedItems
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (err) {
      console.error("Error saving post:", err);
      alert("Failed to save post");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 relative">
      {/* Professional Activity Indicator */}
      <div className="border-l-4 border-pink-500 pl-0">
        
        {/* Header */}
        <div className="flex gap-4 p-8">
          <img
            src={post.user?.avatar}
            className="w-14 h-14 rounded-full border-2 border-pink-100"
          />

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <p className="font-semibold text-gray-900 text-lg">{post.user?.name}</p>
              {post.postType && (
                <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs rounded-full font-medium">
                  {post.postType === 'achievement' && '🎯 Achievement'}
                  {post.postType === 'project' && '💼 Project'}
                  {post.postType === 'insight' && '🔍 Insight'}
                  {post.postType === 'opportunity' && '🔎 Opportunity'}
                  {post.postType === 'update' && '📈 Update'}
                  {post.postType === 'learning' && '📚 Learning'}
                  {post.postType === 'milestone' && '🎯 Milestone'}
                  {post.postType === 'announcement' && '📢 Announcement'}
                </span>
              )}
            </div>
            <p className="text-gray-600 mb-1">
              {post.user?.role} • {post.user?.location}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(post.date).toLocaleDateString()} • {post.visibility || 'Public'}
            </p>
          </div>

          {/* Menu */}
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-pink-600 transition-colors p-2"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Menu Dropdown */}
        {showMenu && (
          <div className="absolute right-6 top-16 bg-white border border-gray-200 rounded-lg shadow-lg text-sm z-20 min-w-[160px]">
            <button
              onClick={handleSavePost}
              className={`flex items-center gap-2 w-full px-4 py-3 hover:bg-pink-50 text-left ${
                saved ? 'text-pink-600' : 'text-gray-700'
              }`}
            >
              <span>📌</span> {saved ? "Already Saved" : "Save for reference"}
            </button>

            {onDelete && (
              <button
                onClick={onDelete}
                className="flex items-center gap-2 w-full px-4 py-3 hover:bg-red-50 text-left text-red-600 border-t"
              >
                <span>🗑</span> {isSaved ? "Remove from Saved" : "Remove post"}
              </button>
            )}
          </div>
        )}

        {/* Title */}
        {post.title && (
          <div className="px-8 pb-2">
            <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
          </div>
        )}

        {/* Content */}
        <div className="px-8 pb-4">
          <p className="text-gray-800 leading-relaxed">{post.content}</p>
        </div>

        {post.image && (
          <div className="px-8 pb-4">
            <img src={post.image} className="w-full rounded-lg max-h-[420px] object-cover border border-gray-200" />
          </div>
        )}

        {/* Engagement Stats */}
        {likes > 0 && (
          <div className="px-8 pb-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <span className="text-pink-600">👏</span> Appreciated by {likes} professionals
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-around border-t border-gray-200 py-3 text-sm">

          <button
            onClick={toggleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              liked 
                ? "text-pink-600 bg-pink-50 font-medium" 
                : "text-gray-600 hover:text-pink-600 hover:bg-pink-50"
            }`}
          >
            <span>👏</span> Appreciate
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors"
          >
            <span>💬</span> Comment
          </button>

          <button
            onClick={sharePost}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors"
          >
            <span>🔗</span> Share
          </button>
        </div>

        {/* Comments */}
        {showComments && (
          <div className="px-8 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-3 mb-4">
              <img
                src="https://i.pravatar.cc/150?img=1"
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 flex gap-2">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a professional comment..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-pink-500 focus:outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && addComment()}
                />
                <button
                  onClick={addComment}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Reply
                </button>
              </div>
            </div>

            {comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                postId={postId}
              />
            ))}
          </div>
        )}

        {saved && (
          <div className="px-8 pb-4">
            <div className="flex items-center gap-2 text-sm text-pink-600 bg-pink-50 rounded-lg px-3 py-2">
              <span>📌</span> Saved to your professional references
            </div>
          </div>
        )}
      </div>
    </div>
  );
}