import React, { useState } from "react";
import { MoreHorizontal, Heart, MessageSquare, SquareArrowOutUpRight, SendHorizonal } from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";

interface PostCardProps {
  user: string;
  institute: string;
  timeAgo: string;
  followers: number;
  content: string;
  imageUrl?: string;
  mediaType?: "TEXT" |"IMAGE" | "VIDEO";
  profileImageUrl?: string;
  postId: number;
  impressions: number;
  onEdit?: (post: {
    postId: number;
    content: string;
    imageUrl?: string;
  }) => void;
  onDelete?: (postId: number) => void;
  onLike?: (postId: number, liked: boolean) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  user,
  institute,
  timeAgo,
  followers,
  content,
  imageUrl,
  mediaType,
  profileImageUrl,
  postId,
  impressions,
  onDelete,
  onEdit,
  onLike,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(impressions);

  const handleDeleteClick = () => {
    setShowMenu(false);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    onDelete?.(postId);
    setShowConfirmModal(false);
  };

  const toggleLike = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikeCount((prev) => prev + (newLikedState ? 1 : -1));
    onLike?.(postId, newLikedState);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-4 m-4 relative">
      {/* 3 Dots */}
      <div className="absolute top-4 right-4">
        <button onClick={() => setShowMenu(!showMenu)}>
          <MoreHorizontal className="w-5 h-5"/>
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 bg-white border shadow rounded text-sm w-40">
            <button
               className="block px-4 py-2 bg-white hover:bg-shark-100  w-full text-left font-secondary rounded-md"
               onClick={() => {
                  setShowMenu(false);
                  onEdit?.({postId, content, imageUrl}); 
            }}
            >
            Edit
          </button>
          <button
              className="block px-4 py-2  bg-white hover:bg-shark-100 w-full text-left text-red-600 font-secondary rounded-md"
              onClick = {handleDeleteClick}
          >
            Delete
          </button>
          </div>
        )}
      </div>

       {/* Custom Confirmation Modal */}
       <ConfirmationModal
        isOpen={showConfirmModal}
        title="Confirm Delete"
        message="Are you sure you want to delete this post?"
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
       />


      {/* Post Contnet */}
      <div className="flex items-center gap-3 mb-2">
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt="Organization"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="bg-gray-200 w-10 h-10 rounded-full" />
        )}
        <div>
          <p className="font-semibold">
            {user}
            <span> {institute}</span>
          </p>
          <div className="text-sm text-shark-400 flex flex-col">
            <span>{followers} followers</span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>

      <p className="mb-2 text-sm">{content}</p>
      {mediaType === "IMAGE" && imageUrl && (
      <img src={imageUrl} alt="Post Media" className="w-full h-auto rounded-lg" />
      )}

      {mediaType === "VIDEO" && imageUrl && (
         <video controls className="w-full h-auto rounded-lg">
         <source src={imageUrl} type="video/mp4" />
          </video>
      )}

      {/* Like count display */}
      <div className="text-sm text-gray-600 mt-2">
      {likeCount} {likeCount === 1 ? "person likes this" : "people like this"}
      </div>



      {/* Like */}
      <div className="flex items-center justify-around text-sm text-gray-600 border-t mt-4 pt-2">
        <button onClick={toggleLike}
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-500"
        >
          <Heart className={`w-5 h-5 ${liked ? "fill-red-500 text-red-500" : "text-gray-400"}`}/>
          <span>Like</span>
        </button>

        {/* Comment */}
        <button className="flex items-center gap-1 hover:text-verdant-500">
          <MessageSquare className="w-5 h-5" />
          <span>Comment</span>
        </button>

        {/* Share */}
        <button className="flex items-center gap-1 hover:text-verdant-500">
          < SquareArrowOutUpRight className="w-5 h-5"/>
          <span>Share</span>
        </button>
      </div>

      {/* Comment Input Section */}
      <div className="mt-4 border-t pt-3">
        <div className="flex gap-6 items-center">
          <input 
              type="text"
              placeholder="Write a comment..."
              className="flex-1 border rounded-full px-4 py-1 h-10 text-sm bg-gray-100 focus:outline-none"
          />
          <SendHorizonal />
        </div>
      </div>


    </div>
  );
};

export default PostCard;
