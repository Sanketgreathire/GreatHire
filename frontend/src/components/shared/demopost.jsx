// import React, { useState } from 'react';
// import { ArrowLeft, Share2, MessageCircle, ThumbsUp, X } from 'lucide-react';

// export default function DemoPost() {
//   const [page, setPage] = useState('profile');

//   const [formData, setFormData] = useState({
//     fullName: '',
//     companyName: '',
//     jobRole: '',
//     location: '',
//     workType: '',
//     joinedDate: '',
//     lastDate: '',
//     experienceDetails: ''
//   });

//   const [previewData, setPreviewData] = useState({});
//   const [posts, setPosts] = useState([]);
//   const [showPostModal, setShowPostModal] = useState(false);
//   const [commentInputs, setCommentInputs] = useState({});

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setPreviewData({ ...formData });
//     setPage('preview');
//   };

//   const handlePost = () => {
//     const newPost = {
//       ...previewData,
//       id: Date.now(),
//       postedTime: new Date().toISOString(),
//       likes: 0,
//       liked: false,
//       comments: [],
//       showComments: false,
//       showShare: false
//     };

//     setPosts([newPost, ...posts]);
//     setPreviewData({});
//     setPage('feed');
//   };

//   const getTimeAgo = (timestamp) => {
//     const diff = Math.floor((new Date() - new Date(timestamp)) / 60000);
//     if (diff < 1) return 'Just now';
//     if (diff < 60) return `${diff}m ago`;
//     if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
//     return `${Math.floor(diff / 1440)}d ago`;
//   };

//   const toggleLike = (id) => {
//     setPosts(posts.map(post =>
//       post.id === id
//         ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
//         : post
//     ));
//   };

//   const toggleCommentBox = (id) => {
//     setPosts(posts.map(post =>
//       post.id === id
//         ? { ...post, showComments: !post.showComments }
//         : post
//     ));
//   };

//   const addComment = (id) => {
//     if (!commentInputs[id]) return;

//     setPosts(posts.map(post =>
//       post.id === id
//         ? { ...post, comments: [...post.comments, commentInputs[id]] }
//         : post
//     ));

//     setCommentInputs({ ...commentInputs, [id]: '' });
//   };

//   const toggleShare = (id) => {
//     setPosts(posts.map(post =>
//       post.id === id
//         ? { ...post, showShare: !post.showShare }
//         : post
//     ));
//   };

//   /* ================= PROFILE PAGE ================= */
//   if (page === 'profile') {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-10">
//         <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-xl">

//           <h1 className="text-3xl font-bold mb-8 text-purple-700 text-center">
//             Add Work Experience
//           </h1>

//           <form onSubmit={handleSubmit} className="space-y-5">

//             {["fullName", "companyName", "jobRole", "location"].map((field) => (
//               <input
//                 key={field}
//                 name={field}
//                 placeholder={field.replace(/([A-Z])/g, ' $1')}
//                 value={formData[field]}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full p-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
//               />
//             ))}

//             <select name="workType" value={formData.workType} onChange={handleInputChange}
//               className="w-full p-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-purple-500 outline-none">
//               <option value="">Select Work Type</option>
//               <option>Full-time</option>
//               <option>Part-time</option>
//               <option>Internship</option>
//               <option>Freelance</option>
//             </select>

//             <div className="grid grid-cols-2 gap-4">
//               <input type="date" name="joinedDate" value={formData.joinedDate} onChange={handleInputChange}
//                 className="p-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-purple-500 outline-none" />
//               <input type="date" name="lastDate" value={formData.lastDate} onChange={handleInputChange}
//                 className="p-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-purple-500 outline-none" />
//             </div>

//             <textarea name="experienceDetails" rows="4" placeholder="Describe your experience..."
//               value={formData.experienceDetails} onChange={handleInputChange}
//               className="w-full p-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none" />

//             <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition">
//               Submit Experience
//             </button>

//           </form>
//         </div>
//       </div>
//     );
//   }

//   /* ================= PREVIEW PAGE ================= */
//   if (page === 'preview') {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-10">
//         <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl">

//           <button onClick={() => setPage('profile')} className="flex items-center mb-4 text-purple-600 font-semibold">
//             <ArrowLeft size={18} className="mr-1" /> Back
//           </button>

//           <h2 className="text-2xl font-bold mb-4 text-purple-700">Preview Post</h2>

//           <div className="border rounded-lg p-5 bg-gray-50 text-gray-800">
//             <h3 className="font-bold text-lg">{previewData.fullName}</h3>
//             <p className="font-semibold text-purple-700">
//               {previewData.jobRole} at {previewData.companyName}
//             </p>
//             <p className="text-sm text-gray-500">
//               {previewData.location} • {previewData.workType}
//             </p>
//             <p className="mt-3 leading-relaxed">{previewData.experienceDetails}</p>
//           </div>

//           <div className="flex gap-3 mt-5">
//             <button onClick={() => setPage('profile')} className="flex-1 border py-2 rounded-lg">
//               Edit
//             </button>
//             <button onClick={handlePost} className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg">
//               Post
//             </button>
//           </div>

//         </div>
//       </div>
//     );
//   }

//   /* ================= FEED PAGE ================= */
//   if (page === 'feed') {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-8">
//         <div className="max-w-2xl mx-auto">

//           <div className="flex justify-between mb-6">
//             <h1 className="text-2xl font-bold text-purple-700">Feed</h1>
//             <button onClick={() => setShowPostModal(true)} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg">
//               Add Post
//             </button>
//           </div>

//           {posts.map(post => (
//             <div key={post.id} className="bg-white p-6 rounded-2xl shadow mb-6 text-gray-800">

//               <h3 className="font-bold text-lg">{post.fullName}</h3>
//               <p className="text-sm text-gray-500">{getTimeAgo(post.postedTime)}</p>

//               <p className="font-semibold text-purple-700 mt-1">
//                 {post.jobRole} at {post.companyName}
//               </p>

//               <p className="text-sm text-gray-500 mb-2">
//                 {post.location} • {post.workType}
//               </p>

//               <p className="mb-4 leading-relaxed">{post.experienceDetails}</p>

//               <div className="flex justify-around border-t pt-3 text-gray-600">

//                 <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-2 ${post.liked ? "text-purple-600" : ""}`}>
//                   <ThumbsUp size={18} /> Like ({post.likes})
//                 </button>

//                 <button onClick={() => toggleCommentBox(post.id)} className="flex items-center gap-2">
//                   <MessageCircle size={18} /> Comment
//                 </button>

//                 <button onClick={() => toggleShare(post.id)} className="flex items-center gap-2">
//                   <Share2 size={18} /> Share
//                 </button>

//               </div>

//               {post.showComments && (
//                 <div className="mt-3">
//                   <input
//                     value={commentInputs[post.id] || ""}
//                     onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
//                     placeholder="Write a comment..."
//                     className="w-full p-2 border rounded-lg mb-2 text-gray-800"
//                   />
//                   <button onClick={() => addComment(post.id)} className="text-purple-600 text-sm font-semibold">
//                     Post Comment
//                   </button>

//                   {post.comments.map((c, i) => (
//                     <p key={i} className="text-sm bg-gray-100 p-2 rounded-lg mt-1">{c}</p>
//                   ))}
//                 </div>
//               )}

//               {post.showShare && (
//                 <div className="mt-3 flex gap-4 text-sm text-purple-600 font-semibold">
//                   <span>WhatsApp</span>
//                   <span>Instagram</span>
//                   <span>LinkedIn</span>
//                   <span>Twitter</span>
//                 </div>
//               )}

//             </div>
//           ))}
//         </div>

//         {/* POST MODAL */}
//         {showPostModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
//             <div className="bg-white p-6 rounded-2xl shadow-lg w-96 text-gray-800">

//               <div className="flex justify-between mb-3">
//                 <h3 className="font-bold text-purple-700">Create Post</h3>
//                 <button onClick={() => setShowPostModal(false)}><X size={18} /></button>
//               </div>

//               <textarea
//                 placeholder="Write your post..."
//                 className="w-full border p-3 rounded-lg mb-3 text-gray-800"
//                 rows="4"
//                 onChange={(e) => setPreviewData({ ...previewData, experienceDetails: e.target.value })}
//               />

//               <div className="flex gap-3">
//                 <button onClick={() => setShowPostModal(false)} className="flex-1 border py-2 rounded-lg">
//                   Cancel
//                 </button>
//                 <button onClick={() => { handlePost(); setShowPostModal(false); }} className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg">
//                   Post
//                 </button>
//               </div>

//             </div>
//           </div>
//         )}

//       </div>
//     );
//   }
// }
