"use client";

import React, { useEffect, useState } from "react";
import PostCard from "@/components/UI/PostCard";
import { 
  getAllPublicPosts, 
  getCurrentOrganizationDetails, 
  getCurrentVolunteerDetails,
  getAllOrganizations
} from "@/services/publicSocialFeedService";
import { reactToPost, removeReaction } from "@/services/reactionService";
import ProfileCard from "@/components/UI/PublicFeedLeftSideBar";
import MetricCard from "@/components/UI/MetricCard";
import { HeartIcon, Share2Icon, FileTextIcon } from "lucide-react";
import { calculateMetrics } from "@/services/utils";
import SuggestedOrganizations from "@/components/UI/SuggestedOrganizations";
import { updatePost } from "@/services/socialFeedService";
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
  ORGANIZATION: "ORGANIZATION" as const,
  VOLUNTEER: "VOLUNTEER" as const,
};

// Type guard for userType
const isVolunteer = (userType: UserType): userType is "VOLUNTEER" => userType === USER_TYPE.VOLUNTEER;
const isOrganization = (userType: UserType): userType is "ORGANIZATION" => userType === USER_TYPE.ORGANIZATION;

const PublicFeedPage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [profile, setProfile] = useState<ProfileCardProps | null>(null);
  const [userId, setUserId] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userType, setUserType] = useState<UserType>("ORGANIZATION"); 
  const [metrics, setMetrics] = useState({
    totalPosts: 0,
    postGrowth: "0%",
    totalImpressions: 0,
    impressionsGrowth: "0%",
    totalShares: 0,
    sharesGrowth: "0%",
  });

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

  // Store organization data in state for later use in other effects
  const [organizationData, setOrganizationData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get public posts
        const postResponse = await getAllPublicPosts();
        console.log("Sample post structure:", postResponse.length > 0 ? JSON.stringify(postResponse[0], null, 2) : "No posts");
        setPosts(postResponse);
        
        // First try as organization (based on JWT token)
        const orgData = await getCurrentOrganizationDetails();
        let detectedUserType: UserType = USER_TYPE.ORGANIZATION;
        let profileId = 0;

        // If organization details not found, try as volunteer
        if (orgData) {
          profileId = orgData.id;
          setUserType(USER_TYPE.ORGANIZATION);
          
          // Save organization data for later use
          setOrganizationData(orgData);
          
          setProfile({
            name: orgData.name,
            institute: orgData.institute,
            about: orgData.description,
            profileImageUrl: orgData.imageUrl,
            isVerified: orgData.isVerified,
          });
        } else {
          // Try volunteer
          const volunteerData = await getCurrentVolunteerDetails();
          if (volunteerData) {
            profileId = volunteerData.id;
            detectedUserType = USER_TYPE.VOLUNTEER;
            setUserType(USER_TYPE.VOLUNTEER);
            
            setProfile({
              name: `${volunteerData.firstName} ${volunteerData.lastName}`,
              institute: volunteerData.institute,
              about: volunteerData.about,
              profileImageUrl: volunteerData.imageUrl,  
              isVerified: undefined,
            });
          }
        }
        
        // If no profile data found for either type
        if (profileId === 0) {
          setError("No user profile found. Please ensure you are properly authenticated.");
          setLoading(false);
          return;
        }

        // Set the detected user ID
        setUserId(profileId);
        
        console.log(`Detected user type: ${detectedUserType}`);

      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Calculate metrics whenever posts or organization data changes
  useEffect(() => {
    if (organizationData && posts.length > 0 && isOrganization(userType)) {
      console.log("Recalculating metrics for organization:", organizationData.name);
      console.log("Total posts available:", posts.length);
      
      // Filter posts that belong to this organization by matching the name
      const orgPosts = posts.filter(post => 
        post.organizationName === organizationData.name
      );
      
      console.log(`Found ${orgPosts.length} posts for ${organizationData.name}`);
      
      // Calculate metrics from filtered posts
      if (orgPosts.length > 0) {
        const calculatedMetrics = calculateMetrics(orgPosts);
        console.log("Calculated metrics:", calculatedMetrics);
        setMetrics(calculatedMetrics);
      }
    }
  }, [posts, organizationData, userType]);

  const handleLike = async (postId: number, liked: boolean) => {
    if (!userId || userId === 0) {
      console.warn("User ID not available for like action");
      return;
    }
    
    try {
      if (liked) {
        await removeReaction(postId, userId, userType);
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { ...post, likes: Math.max((post.likes || 0) - 1, 0) }
              : post
          )
        );
      } else {
        await reactToPost({ socialFeedId: postId, userId, userType: userType });
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="mt-20 flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-verdant-600 mx-auto mb-4"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="mt-20 flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button 
              onClick={() => window.history.back()} 
              className="px-4 py-2 bg-verdant-600 text-white rounded-lg hover:bg-verdant-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </>
    );
  }

  // Don't render if no valid user data
  if (!userId || userId === 0) {
    return (
      <>
        <Navbar />
        <div className="mt-20 flex justify-center items-center min-h-[400px]">
          <p className="text-shark-500">User not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="mt-20 flex flex-col md:flex-row max-w-full mx-auto p-6 gap-6">
        
        {/* Left Sidebar – Dynamic Profile */}
        <aside className="hidden md:block md:w-1/5 -ml-4 mr-16 sticky top-24 self-start">
          {profile && <ProfileCard {...profile} />}
        </aside>

        {/* Main Feed */}
        <main className="w-[48%] space-y-4 bg-[#FBFBFB] p-6 rounded-xl -ml-4">
          {posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-shark-500">No posts available.</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                postId={post.id}
                username={post.handle || post.organizationUsername || ""}
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
                onLike={handleLike}
              />
            ))
          )}
        </main>

        {/* Right Sidebar – Only for ORGANIZATION */}
        {isOrganization(userType) && (
          <aside className="hidden md:block md:w-1/5 space-y-4 sticky top-24 self-start mr-[3%] w-[22%] ml-10">
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
            <SuggestedOrganizations />
          </aside>
        )}

      </div>
    </>
  );
};
export default PublicFeedPage;
