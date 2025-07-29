import { Reaction, CreateReaction, ReactionStatusDTO } from "./types";

const BASE_URL = "http://localhost:8080/api/public/reactions";

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

// Create or toggle a reaction
export async function reactToPost(createReaction: CreateReaction): Promise<Reaction | null> {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(createReaction)
    });

    if (!response.ok) {
      throw new Error("Failed to react to post");
    }

    const result: Reaction = await response.json();
    return result;
  } catch (error) {
    console.error("Error reacting to post:", error);
    return null;
  }
}

// Get all reactions for a specific post
export async function getReactionsForPost(socialFeedId: number): Promise<Reaction[]> {
  try {
    const response = await fetch(`${BASE_URL}/${socialFeedId}/total-reactions`, {
      headers: createHeaders()
    });
    if (!response.ok) {
      throw new Error("Failed to fetch reactions");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting reactions for post:", error);
    return [];
  }
}

// Get user's reaction for a specific post
export async function getUserReaction(
  socialFeedId: number,
  userId: number,
  userType: string
): Promise<ReactionStatusDTO | null> {
  try {
    const response = await fetch(`${BASE_URL}/${socialFeedId}/my-reaction`, {
      headers: createHeaders()
    });

    if (!response.ok) {
      if (response.status === 404) {
        // No reaction found for the user on this post
        return null;
      }

      
      const errorText = await response.text();
      let errorObj = null;
      try {
        errorObj = errorText ? JSON.parse(errorText) : null;
      } catch {
        // Not valid JSON, keep as text
      }

      console.error(`Server error response (${response.status}):`, errorObj || errorText || "No content");
      console.error(`Attempted URL: ${BASE_URL}/${socialFeedId}/my-reaction`);
      throw new Error(`Failed to fetch user reaction: ${response.status} ${response.statusText}`);
    }

    const data: ReactionStatusDTO = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting user reaction:", error);
    return null;
  }
}

// Remove a user's reaction
export async function removeReaction(
  socialFeedId: number,
  userId: number,
  userType: string
): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/${socialFeedId}/remove-reaction`, {
      method: "DELETE",
      headers: createHeaders(),
      body: JSON.stringify({ userId, userType })
    });

    return response.ok;
  } catch (error) {
    console.error("Error removing reaction:", error);
    return false;
  }
}
