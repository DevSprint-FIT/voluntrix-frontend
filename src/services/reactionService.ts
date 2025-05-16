import { Reaction, CreateReaction, ReactionStatusDTO } from "./types";

const BASE_URL = "http://localhost:8080/api/public/reactions";

// Create or toggle a reaction
export async function reactToPost(createReaction: CreateReaction): Promise<Reaction | null> {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
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
    const response = await fetch(`${BASE_URL}/${socialFeedId}`);
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
    const response = await fetch(`${BASE_URL}/${socialFeedId}/${userId}/${userType}`);

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
        
      }

      console.error("Server error response (non-OK):", errorObj || errorText || "No content");
      throw new Error("Failed to fetch user reaction");
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
    const response = await fetch(`${BASE_URL}/${socialFeedId}/${userId}/${userType}`, {
      method: "DELETE",
    });

    return response.ok;
  } catch (error) {
    console.error("Error removing reaction:", error);
    return false;
  }
}
