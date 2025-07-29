import { Post, Organization, ApiResponse, MediaType } from "./types";
import { arrayToDate, getTimeAgoFromDate } from "./utils";

// Get auth token from environment (client-side)
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_AUTH_TOKEN;
  }
  return null;
};

// Get API base URL
const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
};

// Create headers with authorization
const createHeaders = () => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
};

// Fetch posts for the authenticated organization
export async function fetchMyPosts(): Promise<Post[]> {
  try {
    console.log("Fetching posts with URL:", `${getApiBaseUrl()}/social-feed/my-posts`);
    console.log("Headers:", createHeaders());
    
    const response = await fetch(`${getApiBaseUrl()}/social-feed/my-posts`, {
      method: 'GET',
      headers: createHeaders(),
    });
    
    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`Failed to fetch posts: ${response.status} - ${errorText}`);
    }

    const data: Post[] = await response.json();
    console.log("Fetched posts:", data);

    return data.map(post => {
      const createdAtDate = arrayToDate(post.createdAt as unknown as number[]);
      const updatedAtDate = arrayToDate(post.updatedAt as unknown as number[]);

      return {
        ...post,
        timeAgo: getTimeAgoFromDate(createdAtDate),
        createdAt: createdAtDate.toISOString(),
        updatedAt: updatedAtDate.toISOString()
      };
    });

  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

// Fetch organization details for the authenticated organization
export async function fetchMyOrganization(): Promise<Organization> {
  try {
    console.log("Fetching organization with URL:", `${getApiBaseUrl()}/organizations/me`);
    
    const response = await fetch(`${getApiBaseUrl()}/organizations/me`, {
      method: 'GET',
      headers: createHeaders(),
    });
    
    console.log("Organization response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Organization API Error:", errorText);
      
      // If /me endpoint doesn't exist, try getting from token payload
      // You might need to decode the JWT token to get organization ID
      throw new Error(`Failed to fetch organization details: ${response.status} - ${errorText}`);
    }

    const result: ApiResponse<Organization> = await response.json();
    console.log("Fetched organization:", result);
    return result.data;
  } catch (error) {
    console.error("Error fetching organization details:", error);
    throw error;
  }
}

// Alternative: If you don't have /organizations/me endpoint, decode token
export async function fetchOrganizationFromToken(): Promise<Organization> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Decode JWT token to get organization info (basic decode, not verification)
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log("Token payload:", payload);
    
    // If your token contains organization ID, use it
    if (payload.organizationId) {
      const response = await fetch(`${getApiBaseUrl()}/public/organizations/${payload.organizationId}`, {
        method: 'GET',
        headers: createHeaders(),
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch organization details");
      }

      const result: ApiResponse<Organization> = await response.json();
      return result.data;
    }
    
    throw new Error("Organization ID not found in token");
  } catch (error) {
    console.error("Error fetching organization from token:", error);
    throw error;
  }
}

// Create a new post
export async function createPost(
  content: string,
  mediaUrl?: string,
  mediaType?: string,
  mediaSizeInBytes?: number
): Promise<Post | null> {
  try {
    console.log("Creating post with data:", { content, mediaUrl, mediaType, mediaSizeInBytes });
    
    const response = await fetch(`${getApiBaseUrl()}/social-feed`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify({
        content,
        mediaUrl: mediaUrl || null,
        mediaType: mediaType || "NONE",
        mediaSizeInBytes: mediaSizeInBytes || null,
      }),
    });

    console.log("Create post response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error creating post:", errorText);
      throw new Error(`Failed to create post: ${errorText}`);
    }

    const result: Post = await response.json();

    const createdAtDate = arrayToDate(result.createdAt as unknown as number[]);
    const updatedAtDate = arrayToDate(result.updatedAt as unknown as number[]);

    return {
      ...result,
      timeAgo: getTimeAgoFromDate(createdAtDate),
      createdAt: createdAtDate.toISOString(),
      updatedAt: updatedAtDate.toISOString(),
    };
  } catch (error) {
    console.error("Error creating post:", error);
    return null;
  }
}

// Delete a post by ID
export async function deletePost(postId: number): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/social-feed/${postId}`, {
      method: "DELETE",
      headers: createHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error deleting post:", errorText);
      throw new Error(`Failed to delete post: ${errorText}`);
    }

    const result: string = await response.text();
    console.log(result); 
    return true; 
  } catch (error) {
    console.error("Error deleting post:", error);
    return false; 
  }
}

// Update a post
export async function updatePost(
  postId: number,
  content: string,
  mediaUrl?: string,
  impressions?: number,
  shares?: number
): Promise<Post | null> {
  try {
    const body: any = { content };

    if (mediaUrl !== undefined && mediaUrl !== null) {
      body.mediaUrl = mediaUrl;
    }

    if (typeof impressions === "number") {
      body.impressions = impressions;
    }

    if (typeof shares === "number") {
      body.shares = shares;
    }

    const response = await fetch(`${getApiBaseUrl()}/social-feed/${postId}`, {
      method: "PATCH",
      headers: createHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error updating post:", errorText);
      throw new Error(`Failed to update post: ${errorText}`);
    }

    const result: Post = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating post:", error);
    return null;
  }
}