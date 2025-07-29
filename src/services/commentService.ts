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

// Get API base URL from environment variable
const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
};

// Get auth token from environment variable
const getAuthToken = () => {
  return process.env.NEXT_PUBLIC_AUTH_TOKEN;
};

// Create headers with authorization
const createHeaders = (contentType = "application/json") => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": contentType
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
};

// Add comment function
export async function addComment(
  socialFeedId: number,
  content: string
): Promise<Comment> {
  const BASE_URL = getBaseUrl();

  try {
    // Get the authenticated organization's username from /organizations/me endpoint
    const orgResponse = await fetch(`${BASE_URL}/organizations/me`, {
      method: "GET",
      headers: createHeaders()
    });

    if (!orgResponse.ok) {
      throw new Error(`Failed to fetch organization info: ${orgResponse.status}`);
    }

    const orgData = await orgResponse.json();
    const userUsername = orgData.data?.username || orgData.username;
    const userType = "ORGANIZATION"; // Since we're using organization token
    
    console.log("Adding comment with username:", userUsername);
    
    const response = await fetch(`${BASE_URL}/comments`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify({
        socialFeedId,
        userUsername,
        userType,
        content,
      }),
    });
  
    if (!response.ok) {
      let errorText = "";
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = "Could not read error text";
      }
      console.error("Add comment failed:", response.status, errorText);
      throw new Error(`Failed to add comment: ${response.status} ${errorText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}

// Get comments for post
export const getCommentsForPost = async (postId: number): Promise<Comment[]> => {
  try {
    const BASE_URL = getBaseUrl();
    const response = await fetch(`${BASE_URL}/comments/${postId}/all-comments`, {
      headers: createHeaders()
    });
    if (!response.ok) {
      let errorText = "";
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = "Could not read error text";
      }
      console.error("Fetch comments failed:", response.status, errorText);
      throw new Error(`Failed to fetch comments: ${response.status} ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Network or server error while fetching comments:", error);
    throw error;
  }
};

// Delete comment
export const deleteComment = async (commentId: number): Promise<void> => {
  try {
    const BASE_URL = getBaseUrl();
    const response = await fetch(`${BASE_URL}/comments/${commentId}`, {
      method: "DELETE",
      headers: createHeaders()
    });
    
    if (!response.ok) {
      let errorText = "";
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = "Could not read error text";
      }
      console.error("Delete comment failed:", response.status, errorText);
      throw new Error(`Failed to delete comment: ${response.status} ${errorText}`);
    }
  } catch (error) {
    console.error("Network or server error while deleting comment:", error);
    throw error;
  }
};