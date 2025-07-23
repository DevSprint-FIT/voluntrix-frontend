"use client";

import React, { useEffect, useState } from "react";
import PostCard from "@/components/UI/PostCard";
import { getAllPublicPosts} from "@/services/publicSocialFeedService";
import { reactToPost, removeReaction } from "@/services/reactionService";
import ProfileCard from "@/components/UI/PublicFeedLeftSideBar";
import { getOrganizationDetails, getVolunteerDetails } from "@/services/publicSocialFeedService"; 
import MetricCard from "@/components/UI/MetricCard";
import { HeartIcon, Share2Icon, FileTextIcon } from "lucide-react";
import { calculateMetrics } from "@/services/utils";
import SuggestedOrganizations from "@/components/UI/SuggestedOrganizations";
import { updatePost } from "@/services/socialFeedService";
import { fetchPosts } from "@/services/socialFeedService";
import Navbar from "@/components/UI/Navbar";

interface ProfileCardProps {
  name: string;
  institute: string;
  about: string;
  profileImageUrl?: string;
  isVerified?: boolean;
}

export type UserType = "VOLUNTEER" | "ORGANIZATION"; 

const USER_TYPE = {
  ORGANIZATION: "ORGANIZATION",
  VOLUNTEER: "VOLUNTEER",
};

// Type guard for userType
const isVolunteer = (userType: UserType): userType is "VOLUNTEER" => userType === USER_TYPE.VOLUNTEER;
const isOrganization = (userType: UserType): userType is "ORGANIZATION" => userType === USER_TYPE.ORGANIZATION;

const PublicFeedPage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [profile, setProfile] =  useState<ProfileCardProps | null>(null);
  const [metrics, setMetrics] = useState({
      totalPosts: 0,
      postGrowth: "0%",
      totalImpressions: 0,
      impressionsGrowth: "0%",
      totalShares: 0,
      sharesGrowth: "0%",
    });

  const userId = 1;    // 6
  const userType:   "ORGANIZATION" = "ORGANIZATION";   //      "VOLUNTEER" = "VOLUNTEER"
 const username = "IEEESLIT";   //   shanu123

 const handleShareClick = async (postId: number) => {
  try {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    await updatePost(
      postId,
      post.content,
      post.mediaUrl,
      post.impressions,
      (post.shares || 0) + 1
    );

    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId ? { ...p, shares: (p.shares || 0) + 1 } : p
      )
    );

    setMetrics((prevMetrics) => ({
      ...prevMetrics,
      totalShares: prevMetrics.totalShares + 1,
    }));
  } catch (error) {
    console.error("Error sharing post:", error);
  }
};


  useEffect(() => {
    const fetchData = async () => {
      try {
        const postResponse = await getAllPublicPosts();
        setPosts(postResponse);
        setMetrics(calculateMetrics(postResponse));
        

        if(userType === USER_TYPE.VOLUNTEER){
          const volunteerData = await getVolunteerDetails(username);
          if(volunteerData){
            setProfile({
              name: `${volunteerData.firstName} ${volunteerData.lastName}`,
              institute: volunteerData.institute,
              about: volunteerData.about,
              profileImageUrl: volunteerData.imageUrl,  
              isVerified: undefined,
            })
          }
        } else if (userType === USER_TYPE.ORGANIZATION){
          const orgData = await getOrganizationDetails(username);
          if (orgData) {
            setProfile({
              name: orgData.name,
              institute: orgData.institute,
              about: orgData.description,
              profileImageUrl: orgData.imageUrl,
              isVerified: orgData.isVerified,
            });

            // Fetch only the posts by this organization
            const orgPosts = await fetchPosts(orgData.id);
            const orgMetrics = calculateMetrics(orgPosts);
            setMetrics(orgMetrics);

          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, [username, userType]);

  const handleLike = async (postId: number, liked: boolean) => {
  try {
    if (liked) {
      await removeReaction(postId, userId, userType);
      // Update local state - decrease like count
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, likes: (post.likes || 0) - 1 }
            : post
        )
      );
    } else {
      await reactToPost({ socialFeedId: postId, userId, userType });
      // Update local state - increase like count
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, likes: (post.likes || 0) + 1 }
            : post
        )
      );
    }
  } catch (error) {
    console.error("Error toggling like:", error);
  }
};

  return (
    <>
    <Navbar />
    <div className="mt-20 flex flex-col md:flex-row max-w-full mx-auto p-6 gap-6 ">
      
      {/* Left Sidebar – Dynamic Profile */}
      <aside className="hidden md:block md:w-1/5 -ml-4 mr-16 sticky top-24 self-start">
        {profile && <ProfileCard {...profile} />}
      </aside>

      {/* Main Feed */}
      <main className= "w-[48%] space-y-4 bg-[#FBFBFB] p-6 rounded-xl -ml-4">
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              postId={post.id}
              username="{post.organizationUsername}"
              content={post.content}
              imageUrl={post.mediaUrl}
              mediaType={post.mediaType}
              profileImageUrl={post.organizationImageUrl}
              user={post.organizationName}
              institute={(post?.institute ?? "").toUpperCase()}
              followers={post.followers ?? 0}
              impressions={post.impressions}
              timeAgo={post.timeAgo}
              isPublicView={true}
              userId={userId}
              userType={userType}
              handleShareClick={handleShareClick}
            />
          ))
        )}
      </main>

      {/* Right Sidebar – Only for ORGANIZATION */}
    {isOrganization(userType) && (
      <aside className="hidden md:block md:w-1/5 space-y-4 sticky top-24 self-start  mr-[3%] w-[22%] ml-10">
        <MetricCard
          title="Total Posts"
          value={metrics.totalPosts}
          percentageChange={`${metrics.postGrowth} this month`}
          icon={
            <div className="bg-verdant-50 text-verdant-500 rounded-full flex items-center justify-center w-10 h-10 mr-4">
              <FileTextIcon className="w-5 h-5" />
            </div>
          }
        />
        <MetricCard
          title="Impressions"
          value={metrics.totalImpressions}
          percentageChange={`${metrics.impressionsGrowth} this month`}
          icon={
            <div className="bg-verdant-50 text-verdant-500 rounded-full flex items-center justify-center w-10 h-10 mr-4">
              <HeartIcon className="w-5 h-5" />
            </div>
          }
        />
        <MetricCard
          title="Shares"
          value={metrics.totalShares}
          percentageChange={`${metrics.sharesGrowth} this month`}
          icon={
            <div className="bg-verdant-50 text-verdant-500 rounded-full flex items-center justify-center w-10 h-10 mr-4">
              <Share2Icon className="w-5 h-5" />
            </div>
          }
        />
      </aside>

    
    )}

    {/* Right Sidebar – For VOLUNTEER */}
         {isVolunteer(userType) && (
         <aside className="hidden md:block md:w-1/4 space-y-4 sticky top-6 self-start">
         <SuggestedOrganizations volunteerId={userId} />
         </aside>
        )}

    </div>
    </>
  );
};

export default PublicFeedPage;
