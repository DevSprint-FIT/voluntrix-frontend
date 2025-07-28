"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
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
  ORGANIZATION: "ORGANIZATION" as const,
  VOLUNTEER: "VOLUNTEER" as const,
};

// Type guard for userType
const isVolunteer = (userType: UserType): userType is "VOLUNTEER" => userType === USER_TYPE.VOLUNTEER;
const isOrganization = (userType: UserType): userType is "ORGANIZATION" => userType === USER_TYPE.ORGANIZATION;

const PublicFeedPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const [posts, setPosts] = useState<any[]>([]);
  const [profile, setProfile] = useState<ProfileCardProps | null>(null);
  const [userId, setUserId] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actualUserType, setActualUserType] = useState<UserType>("ORGANIZATION"); 
  const [metrics, setMetrics] = useState({
    totalPosts: 0,
    postGrowth: "0%",
    totalImpressions: 0,
    impressionsGrowth: "0%",
    totalShares: 0,
    sharesGrowth: "0%",
  });

  
  const username = React.useMemo(() => {
    if (!params) return null;
    return params.username as string || null;
  }, [params]);

  const urlUserType = React.useMemo(() => {
    if (!searchParams) return "ORGANIZATION" as UserType;
    const type = searchParams.get('type') as UserType;
    return (type === "VOLUNTEER" || type === "ORGANIZATION") ? type : "ORGANIZATION";
  }, [searchParams]);

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
    if (!username) {
      setError("Username is required");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        
        const postResponse = await getAllPublicPosts();
        setPosts(postResponse);
        setMetrics(calculateMetrics(postResponse));

        // Smart detection: try to determine the actual user type
        let detectedUserType: UserType = "ORGANIZATION";
        let profileData = null;
        let fetchedUserId = 0;

        // Strategy: Try both types regardless of URL parameter
        // First try the URL specified type, then try the other type
        
        if (urlUserType === USER_TYPE.ORGANIZATION) {
          // Try organization first
          const orgData = await getOrganizationDetails(username);
          if (orgData && orgData.id) {
            profileData = orgData;
            fetchedUserId = orgData.id;
            detectedUserType = USER_TYPE.ORGANIZATION;
          } else {
            // If organization fails, try volunteer
            const volunteerData = await getVolunteerDetails(username);
            if (volunteerData && volunteerData.id) {
              profileData = volunteerData;
              fetchedUserId = volunteerData.id;
              detectedUserType = USER_TYPE.VOLUNTEER;
            }
          }
        } else {
          // Try volunteer first
          const volunteerData = await getVolunteerDetails(username);
          if (volunteerData && volunteerData.id) {
            profileData = volunteerData;
            fetchedUserId = volunteerData.id;
            detectedUserType = USER_TYPE.VOLUNTEER;
          } else {
            // If volunteer fails, try organization
            const orgData = await getOrganizationDetails(username);
            if (orgData && orgData.id) {
              profileData = orgData;
              fetchedUserId = orgData.id;
              detectedUserType = USER_TYPE.ORGANIZATION;
            }
          }
        }

        // If no data found for either type
        if (!profileData || !fetchedUserId) {
          setError("User not found");
          return;
        }

        // Set the detected user type and ID
        setUserId(fetchedUserId);
        setActualUserType(detectedUserType); // Update the actual detected type

        console.log(`Detected user type: ${detectedUserType} for username: ${username}`);

        // Set profile data based on detected type
        if (detectedUserType === USER_TYPE.VOLUNTEER) {
          const volunteerData = profileData as any;
          setProfile({
            name: `${volunteerData.firstName} ${volunteerData.lastName}`,
            institute: volunteerData.institute,
            about: volunteerData.about,
            profileImageUrl: volunteerData.imageUrl,  
            isVerified: undefined,
          });
        } else if (detectedUserType === USER_TYPE.ORGANIZATION) {
          const orgData = profileData as any;
          setProfile({
            name: orgData.name,
            institute: orgData.institute,
            about: orgData.description,
            profileImageUrl: orgData.imageUrl,
            isVerified: orgData.isVerified,
          });

          // Fetch only the posts by this organization for metrics
          const orgPosts = await fetchPosts(fetchedUserId);
          const orgMetrics = calculateMetrics(orgPosts);
          setMetrics(orgMetrics);
        }

      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username, urlUserType]);

  const handleLike = async (postId: number, liked: boolean) => {
    if (!userId || userId === 0) {
      console.warn("User ID not available for like action");
      return;
    }
    
    try {
      if (liked) {
        await removeReaction(postId, userId, actualUserType); // Use actualUserType
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { ...post, likes: Math.max((post.likes || 0) - 1, 0) }
              : post
          )
        );
      } else {
        await reactToPost({ socialFeedId: postId, userId, userType: actualUserType }); // Use actualUserType
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
                username={post.organizationUsername}
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
                userType={actualUserType} // Use actualUserType
                handleShareClick={handleShareClick}
                onLike={handleLike}
              />
            ))
          )}
        </main>

        {/* Right Sidebar – Only for ORGANIZATION */}
        {isOrganization(actualUserType) && ( // Use actualUserType
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
        {isVolunteer(actualUserType) && ( // Use actualUserType
          <aside className="hidden md:block md:w-1/4 space-y-4 sticky top-6 self-start">
            <SuggestedOrganizations volunteerId={userId} />
          </aside>
        )}

      </div>
    </>
  );
};
export default PublicFeedPage;