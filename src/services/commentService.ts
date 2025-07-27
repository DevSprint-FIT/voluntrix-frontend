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

// Add comment function
export async function addComment(
  socialFeedId: number,
  userUsername: string,
  userType: string,
  content: string
): Promise<Comment> {
  const response = await fetch(`http://localhost:8080/api/public/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
}

// Get comments for post
export const getCommentsForPost = async (postId: number): Promise<Comment[]> => {
  try {
    const response = await fetch(`http://localhost:8080/api/public/comments/${postId}`);
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
    const response = await fetch(`http://localhost:8080/api/public/comments/${commentId}`, {
      method: "DELETE",
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