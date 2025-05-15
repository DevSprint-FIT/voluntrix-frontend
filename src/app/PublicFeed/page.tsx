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

  const userId = 1;
  const userType: "ORGANIZATION" = "ORGANIZATION"; 
 const username = "IEEESLIT"; 

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
              profileImageUrl: undefined, 
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
      } else {
        await reactToPost({ socialFeedId: postId, userId, userType });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row max-w-full mx-auto p-6 gap-6">
      
      {/* Left Sidebar – Dynamic Profile */}
      <aside className="hidden md:block md:w-1/5 -ml-8 mr-10 sticky top-6 self-start">
        {profile && <ProfileCard {...profile} />}
      </aside>

      {/* Main Feed */}
      <main className="w-full md:w-3/5">
        <h1 className="text-2xl font-secondary font-bold mb-4">Social Feed</h1>
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              postId={post.id}
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
              onLike={handleLike}
              userId={userId}
              userType={userType}
            />
          ))
        )}
      </main>

      {/* Right Sidebar – Only for ORGANIZATION */}
    {isOrganization(userType) && (
      <aside className="hidden md:block md:w-1/5 space-y-4 sticky top-6 self-start">
        <MetricCard
          title="Total Posts"
          value={posts.length}
          percentageChange={`${metrics.postGrowth} this month`}
          icon={
            <div className="bg-verdant-100 text-verdant-500 rounded-full flex items-center justify-center w-10 h-10 mr-4">
              <FileTextIcon className="w-5 h-5" />
            </div>
          }
        />
        <MetricCard
          title="Impressions"
          value={posts.reduce((sum, post) => sum + (post.impressions || 0), 0)}
          percentageChange={`${metrics.impressionsGrowth} this month`}
          icon={
            <div className="bg-verdant-100 text-verdant-500 rounded-full flex items-center justify-center w-10 h-10 mr-4">
              <HeartIcon className="w-5 h-5" />
            </div>
          }
        />
        <MetricCard
          title="Shares"
          value={posts.reduce((sum, post) => sum + (post.shares || 0), 0)}
          percentageChange={`${metrics.sharesGrowth} this month`}
          icon={
            <div className="bg-verdant-100 text-verdant-500 rounded-full flex items-center justify-center w-10 h-10 mr-4">
              <Share2Icon className="w-5 h-5" />
            </div>
          }
        />
      </aside>

    
    )}

    {/* Right Sidebar – For VOLUNTEER */}
         {isVolunteer(userType) && (
         <aside className="hidden md:block md:w-1/5 space-y-4 sticky top-6 self-start">
         <SuggestedOrganizations volunteerId={userId} />
         </aside>
        )}

    </div>
  );
};

export default PublicFeedPage;
