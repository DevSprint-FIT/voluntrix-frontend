"use client";

import React, { useEffect, useState } from "react";
import MetricCard from "@/components/UI/MetricCard";
import { HeartIcon, Share2Icon, FileTextIcon, UploadCloud } from "lucide-react";
import PostCard from "@/components/UI/PostCard";
import PostModal from "@/components/UI/PostModal";
import {
  fetchOrganizationById,
  fetchPosts,
  createPost,
  deletePost,
  updatePost,
} from "@/services/socialFeedService";
import { Post, Organization } from "@/services/types";
import { calculateMetrics, calculateTotalMediaSize } from "@/services/utils";

export default function SocialFeed() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<{
    postId: number;
    content: string;
    imageUrl?: string;
  } | null>(null);
  const [metrics, setMetrics] = useState({
    totalPosts: 0,
    postGrowth: "0%",
    totalImpressions: 0,
    impressionsGrowth: "0%",
    totalShares: 0,
    sharesGrowth: "0%",
  });
  const [filter, setFilter] = useState('all');

  const organizationId = 1;
  const userId = 1;
  const userType = "ORGANIZATION";

  useEffect(() => {
    const loadData = async () => {
      try {
        const org = await fetchOrganizationById(organizationId);
        setOrganization(org);
        const fetchedPosts = await fetchPosts(org.id);
        setPosts(Array.isArray(fetchedPosts) ? [...fetchedPosts].reverse() : []);
        setMetrics(calculateMetrics(fetchedPosts));
      } catch (error) {
        console.error("Error loading social feed data:", error);
      }
    };
    loadData();
  }, [organizationId]);

  const handlePostSubmit = async (
    content: string,
    mediaUrl?: string,
    mediaSizeInBytes?: number,
    mediaType?: "NONE" | "IMAGE" | "VIDEO"
  ) => {
    if (!organization) {
      console.error("Organization data is not available.");
      return;
    }

    try {
      
      if (editingPost) {
        const updatedPost = await updatePost(editingPost.postId, content, mediaUrl);

       
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === editingPost.postId
              ? { ...post, content, mediaUrl }
              : post
          )
        );
        setEditingPost(null);
      } else {
        //  creating a new post, submit it and add to the state
        const newPost = await createPost(content, organization.id, mediaUrl, mediaType, mediaSizeInBytes);
        if (newPost) {
          setPosts((prevPosts) => [newPost, ...prevPosts]);
        }
      }

      
      setShowModal(false);
    } catch (error) {
      console.error("Error submitting or updating post:", error);
    }
  };

  const handleDeletePost = async (postId: number) => {
    console.log("Deleting post with ID:", postId);
    try {
      const success = await deletePost(postId);
      console.log("Delete success:", success);
      if (success) {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } else {
        console.error("Delete failed: No response or failed to delete");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  

  const totalMediaSizeInGB = calculateTotalMediaSize(posts); 
  const storageLimitInGB = 15;
  const storageUsedPercentage = (totalMediaSizeInGB / storageLimitInGB) * 100;

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    if (filter === 'all') return true;
    if (filter === 'images' && post.mediaType === 'IMAGE') return true;
    if (filter === 'videos' && post.mediaType === 'VIDEO') return true;
    return false;
  });

  const handleLikeClick = async (postId: number, liked: boolean) => {
    // Update the impressions based on the like status
    const updatedPost = posts.find((post) => post.id === postId);
    if (updatedPost) {
      const currentImpressions = updatedPost.impressions || 0;  

      // Update the post in local state
      updatedPost.impressions = liked ? currentImpressions + 1 : currentImpressions - 1;

      //  update the UI
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...updatedPost } : post
        )
      );

      
      try {
        await updatePost(postId, updatedPost.content, updatedPost.mediaUrl, updatedPost.impressions);
      } catch (error) {
        console.error("Failed to update like count in the database:", error);
        
      }
    }
  };

  return (
    <div>
      <div className="pl-4">
        <p className="text-shark-300">Organization / Social Feed</p>
        <h1 className="font-secondary text-2xl font-bold">Social Feed</h1>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Left Content */}
        <div className="md:col-span-3 space-y-4 mt-1">
          {/* Start a Post */}
          <div className="bg-[#F8F8F8] p-6 rounded-xl mb-4">
            <div className="flex items-center gap-3">
              {organization?.imageUrl ? (
                <img
                  src={organization.imageUrl}
                  className="w-10 h-10 rounded-full object-cover"
                  alt="Organization"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-300 rounded-full" />
              )}
              <button
                onClick={() => setShowModal(true)}
                className="flex-1 text-left px-8 py-2 border mr-4 ml-4 bg-white border-shark-100 font-secondary rounded-2xl text-shark-900 font-medium"
              >
                Start a post
              </button>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-[#F8F8F8] p-4 rounded-xl">
            <h2 className="text-lg font-semibold mb-4">All activity</h2>
            <div className="flex gap-3 p-2">
              <button
                  onClick={() => setFilter('all')}
                  className={`w-20 px-4 py-1 rounded-full ${filter === 'all' ? 'bg-shark-400' : 'bg-shark-950'} text-white hover:bg-shark-400`}
              >
                Posts
              </button>
              <button
                  onClick={() => setFilter('images')}
                  className={`w-20 px-4 py-1 rounded-full ${filter === 'images' ? 'bg-shark-400' : 'bg-shark-950'} text-white hover:bg-shark-400`}
              >
                Images
              </button>
              <button 
                  onClick={() => setFilter('videos')}
                  className={`w-20 px-4 py-1 rounded-full ${filter === 'videos' ? 'bg-shark-400' : 'bg-shark-950'} text-white hover:bg-shark-400`}
              >
                    Videos
              </button>
            </div>
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                user={post.organizationName}
                institute={(organization?.institute ?? "").toUpperCase()}
                followers={organization?.followerCount ?? 0}
                timeAgo={post.timeAgo ?? ""}
                content={post.content}
                imageUrl={post.mediaUrl}
                profileImageUrl={organization?.imageUrl}
                postId={post.id}
                impressions={post.impressions || 0}
                userId={userId}
                userType={userType}
                mediaType={post.mediaType}
                isPublicView={false}
                onEdit={() =>
                  setEditingPost({
                    postId: post.id,
                    content: post.content,
                    imageUrl: post.mediaUrl,
                  })
                }
                onDelete={handleDeletePost}
                onLike={handleLikeClick}
              />
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          <MetricCard
            title="Total Posts"
            value={posts.length}
            percentageChange={`${metrics.postGrowth} this month`}
            icon={
              <div className="bg-verdant-100 text-verdant-500 rounded-full flex items-center justify-center w-10 h-10 mr-4 ">
                <FileTextIcon className="w-5 h-5" />
              </div>
            }
          />
          <MetricCard
            title="Impressions"
            value={posts.reduce((sum, post) => sum + (post.impressions || 0), 0)}
            percentageChange={`${metrics.impressionsGrowth} this month`}
            icon={
              <div className="bg-verdant-100 text-verdant-500 rounded-full flex items-center justify-center w-10 h-10 mr-4 ">
                <HeartIcon className="w-5 h-5" />
              </div>
            }
          />
          <MetricCard
            title="Shares"
            value={posts.reduce((sum, post) => sum + (post.shares || 0), 0)}
            percentageChange={`${metrics.sharesGrowth} this month`}
            icon={
              <div className="bg-verdant-100 text-verdant-500 rounded-full flex items-center justify-center w-10 h-10 mr-4 ">
                <Share2Icon className="w-5 h-5" />
              </div>
            }
          />

          {/* Storage Card */}
          <div className="bg-[#F8F8F8] p-5 rounded-xl">
            <div className="flex justify-between items-start mb-2">
              <div className="font-secondary text-xs bg-shark-100 rounded-full p-2">FREE PLAN</div>
              <div className="bg-verdant-100 text-verdant-500 rounded-full flex items-center justify-center w-10 h-10 ml-4 ">
                <UploadCloud className="w-6 h-6" />
              </div>
            </div>

            <div className="text-center">
               <h3 className="font-bold mb-1 font-secondary text-xl">Your Storage</h3>
               <p className="text-sm text-gray-500 mb-3">Supervise your drive space<br/> in the easiest way</p>
               <button className="bg-verdant-100 rounded-full pl-2 pr-2 pt-1 pb-1 text-verdant-700 border border-verdant-700">Upgrade</button>
            </div>
            
            <div className="bg-gray-100 rounded-full h-2 overflow-hidden mb-2 mt-2">
              <div
                className="bg-verdant-500 h-full"
                style={{ width: `${Math.min(storageUsedPercentage, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{totalMediaSizeInGB.toFixed(2)} GB</span>
              <span>{storageLimitInGB} GB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {(showModal || editingPost) && organization && (
        <PostModal
          isEditing={!!editingPost}
          onClose={() => {
            setShowModal(false);
            setEditingPost(null);
          }}
          onSubmit={async (content, mediaUrl, mediaSizeInBytes, mediaType) => {
            if (editingPost) {
              await updatePost(editingPost.postId, content, mediaUrl);
              const updatedPosts = posts.map((post) =>
                post.id === editingPost.postId
                  ? { ...post, content, mediaUrl }
                  : post
              );
              setPosts(updatedPosts);
              setEditingPost(null);
            } else {
              await handlePostSubmit(content, mediaUrl, mediaSizeInBytes, mediaType);
              setShowModal(false);
            }
          }}
          organizationName={organization.name}
          organizationImageUrl={organization.imageUrl}
          initialContent={editingPost?.content || ""}
          initialImageUrl={editingPost?.imageUrl || ""}
        />
      )}
    </div>
  );
}
