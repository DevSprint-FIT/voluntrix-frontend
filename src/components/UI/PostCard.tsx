import React, { useState, useEffect } from "react";
import {
  MoreHorizontal,
  Heart,
  MessageSquare,
  SquareArrowOutUpRight,
  SendHorizonal,
} from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";
import ShareModal from "./ShareModal";

import {
  getUserReaction,
  reactToPost,
  removeReaction,
  getReactionsForPost,
} from "@/services/reactionService";

import {
  addComment,
  getCommentsForPost,
  deleteComment,
} from "@/services/commentService";

import { getTimeAgoFromDate } from "@/services/utils";

interface PostCardProps {
  user: string;
  username: string;
  institute: string;
  timeAgo: string;
  followers: number;
  content: string;
  imageUrl?: string;
  mediaType?: "NONE" | "IMAGE" | "VIDEO";
  profileImageUrl?: string;
  postId: number;
  impressions: number;
  userId: number;
  userType: string;
  isPublicView?: boolean;
  onEdit?: (post: { postId: number; content: string; imageUrl?: string }) => void;
  onDelete?: (postId: number) => void;
  onLike?: (postId: number, liked: boolean) => void;
  handleShareClick: (postId: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  user,
  username,
  institute,
  timeAgo,
  followers,
  content,
  imageUrl,
  mediaType,
  profileImageUrl,
  postId,
  impressions,
  userId,
  userType,
  isPublicView = false,
  onDelete,
  onEdit,
  onLike,
  handleShareClick,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [openCommentMenuId, setOpenCommentMenuId] = useState<number | null>(null);

  const handleDeleteClick = () => {
    setShowMenu(false);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    onDelete?.(postId);
    setShowConfirmModal(false);
  };

 const toggleLike = async () => {
  const newLikedState = !liked;
  setLiked(newLikedState);

  try {
    if (newLikedState) {
      await reactToPost({ socialFeedId: postId, userId, userType });
    } else {
      await removeReaction(postId, userId, userType);
    }

    // Fetch updated reactions to get accurate count
    const allReactions = await getReactionsForPost(postId);
    const totalLikes = allReactions.filter((r) => r.reacted).length;
    setLikeCount(totalLikes);
  } catch (error) {
    console.error("Error toggling like:", error);
    setLiked(!newLikedState);
  }
  
};

  const onShare = (platform: string) => {
    handleShareClick(postId);
    setShowShareModal(false);
  };

  const handleCommentSubmit = async () => {
    try {
      await addComment(postId, "IEEESLIT", "ORGANIZATION", commentText);
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  useEffect(() => {
    const fetchReactionsAndUserReaction = async () => {
      const allReactions = await getReactionsForPost(postId);
      const totalLikes = allReactions.filter((r) => r.reacted).length;
      setLikeCount(totalLikes);

      const userReaction = await getUserReaction(postId, userId, userType);
      if (userReaction) {
        setLiked(userReaction.reacted);
      }
    };

    fetchReactionsAndUserReaction();
  }, [postId, userId, userType]);

  return (
    <div className="bg-white p-4 rounded-xl mb-4 m-4 relative">
      {!isPublicView && (
        <div className="absolute top-4 right-4">
          <button onClick={() => setShowMenu(!showMenu)}>
            <MoreHorizontal className="w-5 h-5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 bg-white border rounded text-sm w-40">
              <button
                className="block px-4 py-2 bg-white hover:bg-shark-100 w-full text-left font-secondary rounded-md"
                onClick={() => {
                  setShowMenu(false);
                  onEdit?.({ postId, content, imageUrl });
                }}
              >
                Edit
              </button>
              <button
                className="block px-4 py-2 bg-white hover:bg-shark-100 w-full text-left text-red-600 font-secondary rounded-md"
                onClick={handleDeleteClick}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Confirm Delete"
        message="Are you sure you want to delete this post?"
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
      />

      {/* Post Header */}
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
          <p className="font-semibold font-secondary text-shark-950">
            {user} <span>{institute}</span>
          </p>
          <div className="text-sm text-shark-500 flex flex-col">
            <span>{followers} followers</span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <p className="mb-2 text-sm">{content}</p>
      {mediaType === "IMAGE" && imageUrl && (
        <img src={imageUrl} alt="Post Media" className="w-full h-auto rounded-lg" />
      )}
      {mediaType === "VIDEO" && imageUrl && (
        <video controls className="w-full h-auto rounded-lg">
          <source src={imageUrl} type="video/mp4" />
        </video>
      )}

      {/* Like count */}
      <div className="text-sm text-shark-600 mt-2">
        {likeCount} {likeCount === 1 ? "person likes this" : "people like this"}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-around text-sm text-gray-600 border-t mt-4 pt-2">
        <button
          onClick={toggleLike}
          className="flex items-center gap-1 text-sm text-shark-600 hover:text-shark-950"
        >
          <Heart
            className={`w-5 h-5 ${
              liked ? "fill-red-500 text-red-500" : "text-shark-400"
            }`}
          />
          <span>Like</span>
        </button>

        <button
          className="flex items-center gap-1 hover:text-shark-950"
          onClick={async () => {
            if (!showComments) {
              setLoadingComments(true);
              try {
                const fetchedComments = await getCommentsForPost(postId);
                setComments(fetchedComments);
              } catch (err) {
                console.error("Error fetching comments:", err);
              } finally {
                setLoadingComments(false);
              }
            }
            setShowComments((prev) => !prev);
          }}
        >
          <MessageSquare className="w-5 h-5" />
          <span>Comment</span>
        </button>

        <button
          className="flex items-center gap-1 hover:text-shark-950"
          onClick={() => setShowShareModal(true)}
        >
          <SquareArrowOutUpRight className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>

      {/* Comment Section */}
      <div className="mt-4 border-t pt-3">
        <div className="flex gap-6 items-center">
          <input
            type="text"
            placeholder="Write a comment..."
            className="flex-1 border rounded-full px-4 py-1 h-10 text-sm bg-shark-50 focus:outline-none"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCommentSubmit();
              }
            }}
          />
          <button onClick={handleCommentSubmit} aria-label="Send comment">
            <SendHorizonal />
          </button>
        </div>

        {showComments && (
          <div className="mt-4 space-y-3 text-sm">
            {loadingComments ? (
              <p className="text-gray-500">Loading comments...</p>
            ) : comments.length === 0 ? (
              <p className="text-gray-500">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex flex-col">
                  <div className="flex items-start gap-3">
                    {comment.profileImageUrl ? (
                      <img
                        src={comment.profileImageUrl}
                        alt={`${comment.commenterName}'s profile`}
                        className="w-8 h-8 rounded-full bg-shark-100 shrink-0 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-shark-100 shrink-0" />
                    )}
                    <div className="bg-[#FBFBFB] px-4 py-2 rounded-2xl max-w-[95%] relative pr-10">
                      <p className="font-semibold text-sm mb-0.5">
                        {comment.commenterName}
                      </p>
                      <p className="text-sm">{comment.content}</p>
                      <button
                        className="absolute top-1 right-1 p-1 hover:bg-gray-200 rounded-full"
                        onClick={() =>
                          setOpenCommentMenuId(
                            openCommentMenuId === comment.id ? null : comment.id
                          )
                        }
                        aria-label="Open comment options"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {openCommentMenuId === comment.id && (
                        <div className="absolute -top-5 left-full ml-2 bg-white border rounded-md shadow-sm">
                          <button
                            className="block px-6 py-2 text-red-600 hover:text-red-500 w-full text-right rounded"
                            onClick={() => {
                              handleCommentDelete(comment.id);
                              setOpenCommentMenuId(null);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 ml-11 mt-1">
                    {getTimeAgoFromDate(new Date(comment.createdAt))}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareUrl={`http://localhost:3000/Organization/feed/${postId}`}
        handleShareClick={(platform) => onShare(platform)}
      />
    </div>
  );
};

export default PostCard;
