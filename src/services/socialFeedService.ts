import { Post, Organization, ApiResponse, MediaType } from "./types";
import { arrayToDate, getTimeAgoFromDate } from "./utils";
import authService from "./authService"; // Import the auth service

// Get API base URL
const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
};

// Fetch posts for the authenticated organization
export async function fetchMyPosts(): Promise<Post[]> {
  try {
    console.log("Fetching posts with URL:", `${getApiBaseUrl()}/api/social-feed/my-posts`);
    
    const response = await fetch(`${getApiBaseUrl()}/api/social-feed/my-posts`, {
      method: 'GET',
      headers: authService.getAuthHeaders(),
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
    console.log("Fetching organization with URL:", `${getApiBaseUrl()}/api/organizations/me`);
    
    const response = await fetch(`${getApiBaseUrl()}/api/organizations/me`, {
      method: 'GET',
      headers: authService.getAuthHeaders(),
    });
    
    console.log("Organization response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Organization API Error:", errorText);
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

// Create a new post
export async function createPost(
  content: string,
  mediaUrl?: string,
  mediaType?: string,
  mediaSizeInBytes?: number
): Promise<Post | null> {
  try {
    console.log("Creating post with data:", { content, mediaUrl, mediaType, mediaSizeInBytes });
    
    const response = await fetch(`${getApiBaseUrl()}/api/social-feed`, {
      method: "POST",
      headers: authService.getAuthHeaders(),
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
    const response = await fetch(`${getApiBaseUrl()}/api/social-feed/${postId}`, {
      method: "DELETE",
      headers: authService.getAuthHeaders(),
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

    const response = await fetch(`${getApiBaseUrl()}/api/social-feed/${postId}`, {
      method: "PATCH",
      headers: authService.getAuthHeaders(),
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