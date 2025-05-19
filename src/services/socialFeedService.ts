import { Post, Organization, ApiResponse, MediaType } from "./types";
import { arrayToDate, getTimeAgoFromDate } from "./utils";

// Fetch posts by organization ID
export async function fetchPosts(organizationId: number): Promise<Post[]> {
  try {
    const response = await fetch(`http://localhost:8080/api/public/social-feed/organization/${organizationId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }

    const data: Post[] = await response.json();

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

// Fetch organization details by organization ID
export async function fetchOrganizationById(organizationId: number): Promise<Organization> {
  try {
    const response = await fetch(`http://localhost:8080/api/public/organizations/${organizationId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch organization details");
    }

    const result: ApiResponse<Organization> = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching organization by ID:", error);
    throw error;
  }
}

// Create a new post
export async function createPost(
  content: string,
  organizationId: number,
  mediaUrl?: string,
  mediaType?: string,
  mediaSizeInBytes?: number
): Promise<Post | null> {
  try {
    const response = await fetch("http://localhost:8080/api/public/social-feed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        organizationId,
        mediaUrl: mediaUrl || null,
        mediaType: mediaType || "NONE",
        mediaSizeInBytes: mediaSizeInBytes || null,
      }),
    });

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


//Delete a post by ID
export async function deletePost(postId: number): Promise<boolean> {
  try{
    const response = await fetch(`http://localhost:8080/api/public/social-feed/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if(!response.ok){
      const errorText = await response.text();
      console.error("Error deleting post:", errorText);
      throw new Error(`Failed to delete post: ${errorText}`);
    }

    const result: string = await response.text();
    console.log(result); 
    return true; 
  } catch(error) {
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

    if (typeof shares === "number"){
      body.shares = shares;
    }

    const response = await fetch(`http://localhost:8080/api/public/social-feed/${postId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
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
  
