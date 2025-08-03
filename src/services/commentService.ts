import authService from "./authService"; 

// Comment interface
export interface Comment {
  id: number;
  socialFeedId: number;
  commenterName: string;
  userType: string;
  content: string;
  createdAt: string;
  ProfileImageUrl?: string; 
}

// Get API base URL 
const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
};

// Helper function to get current user info based on user type - NOW EXPORTED
export async function getCurrentUserInfo(): Promise<{username: string, userType: string, profileImageUrl?: string, fullName?: string, rawData?: any}> {
  const baseUrl = getBaseUrl();
  
  try {
    const volunteerResponse = await fetch(`${baseUrl}/api/volunteers/me`, {
      method: "GET",
      headers: authService.getAuthHeaders()
    });

    if (volunteerResponse.ok) {
      const volunteerData = await volunteerResponse.json();
      console.log("Raw volunteer data:", volunteerData); // Debug log
      
      const username = volunteerData.username || `volunteer_${volunteerData.volunteerId}`;
      
      // Use the fullName field directly from the API response
      const fullName = volunteerData.fullName || username;
      
      console.log("Volunteer data extracted:", { username, fullName, volunteerId: volunteerData.volunteerId }); // Debug log
      
      return {
        username,
        userType: "VOLUNTEER",
        profileImageUrl: volunteerData.profilePictureUrl || volunteerData.imageUrl || null,
        fullName,
        rawData: volunteerData
      };
    }
  } catch {}

  try {
    const orgResponse = await fetch(`${baseUrl}/api/organizations/me`, {
      method: "GET",
      headers: authService.getAuthHeaders()
    });

    if (orgResponse.ok) {
      const orgData = await orgResponse.json();
      console.log("Raw organization data:", orgData); // Debug log
      
      const username = orgData.data?.username || orgData.username || orgData.data?.name || orgData.name;
      const fullName = orgData.data?.name || orgData.name || username;
      
      return {
        username,
        userType: "ORGANIZATION",
        profileImageUrl: orgData.profilePictureUrl || null,
        fullName,
        rawData: orgData
      };
    }
  } catch {}

  throw new Error("Unable to determine user type or fetch user info");
}

// Add comment function
export async function addComment(
  socialFeedId: number,
  content: string
): Promise<Comment> {
  const baseUrl = getBaseUrl();

  try {
    const { username, userType, profileImageUrl, fullName } = await getCurrentUserInfo();
    console.log("Adding comment with user info:", { username, userType, fullName }); // Debug log

    const requestBody = {
      socialFeedId,
      userUsername: username,
      userType,
      content,
      profileImageUrl
    };
    
    const response = await fetch(`${baseUrl}/api/comments`, {
      method: "POST",
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add comment: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log("Comment added, response:", result); // Debug log
    return result;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}

// Get comments for post
export const getCommentsForPost = async (postId: number): Promise<Comment[]> => {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/comments/${postId}/all-comments`, {
      method: "GET",
      headers: authService.getAuthHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch comments: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("Fetched comments:", result); // Debug log
    return result;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

// Delete comment
export const deleteComment = async (commentId: number): Promise<void> => {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/comments/${commentId}`, {
      method: "DELETE",
      headers: authService.getAuthHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete comment: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

