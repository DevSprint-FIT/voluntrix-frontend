import authService from "./authService"; // Import the auth service

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

// Add comment function
export async function addComment(
  socialFeedId: number,
  content: string
): Promise<Comment> {
  const baseUrl = getBaseUrl();

  try {
    // Get the authenticated organization's username from /organizations/me endpoint
    const orgResponse = await fetch(`${baseUrl}/api/organizations/me`, {
      method: "GET",
      headers: authService.getAuthHeaders()
    });

    if (!orgResponse.ok) {
      const errorText = await orgResponse.text();
      console.error("Failed to fetch organization info:", errorText);
      throw new Error(`Failed to fetch organization info: ${orgResponse.status} - ${errorText}`);
    }

    const orgData = await orgResponse.json();
    const userUsername = orgData.data?.username || orgData.username;
    const userType = "ORGANIZATION"; // Since we're using organization token
    
    console.log("Adding comment with username:", userUsername);
    
    const response = await fetch(`${baseUrl}/api/comments`, {
      method: "POST",
      headers: authService.getAuthHeaders(),
      body: JSON.stringify({
        socialFeedId,
        userUsername,
        userType,
        content,
      }),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Add comment failed:", response.status, errorText);
      throw new Error(`Failed to add comment: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
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
      console.error("Fetch comments failed:", response.status, errorText);
      throw new Error(`Failed to fetch comments: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Network or server error while fetching comments:", error);
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
      console.error("Delete comment failed:", response.status, errorText);
      throw new Error(`Failed to delete comment: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error("Network or server error while deleting comment:", error);
    throw error;
  }
};