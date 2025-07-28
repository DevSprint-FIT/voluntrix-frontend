import { Post } from "./types";
import { arrayToDate, getTimeAgoFromDate } from "./utils";
import { PublicFeedOrganizationDetails, PublicFeedVolunteerDetails } from "./types";

export async function getAllPublicPosts(): Promise<Post[]> {
  try {
    const res = await fetch("http://localhost:8080/api/public/social-feed");
    if(!res.ok)
      throw new Error("Failed to fetch public posts");
    const data: Post[] = await res.json();
    return data.map(post => {
      const createdAtDate = arrayToDate(post.createdAt as unknown as number[]);
      const updatedAtDate = arrayToDate(post.updatedAt as unknown as number[]);
      return {
        ...post,
        timeAgo: getTimeAgoFromDate(createdAtDate),
        createdAt: createdAtDate.toISOString(),
        updatedAt: updatedAtDate.toISOString()
      };
    })
  } catch (error) {
    console.error("Error fetching public posts:", error);
    return [];
  }
}

// Temporary debug version - replace your getVolunteerDetails function with this
export async function getVolunteerDetails(username: string): Promise<PublicFeedVolunteerDetails | null> {
  try {
    console.log(`Trying to fetch volunteer: ${username}`);
    const res = await fetch(`http://localhost:8080/api/public/volunteers/${username}`);
    
    if (!res.ok) {
      console.log(`Volunteer API returned ${res.status}: ${res.statusText} for ${username}`);
      return null;
    }
    
    const data = await res.json();
    console.log("Raw volunteer API response:", data); // DEBUG: See exact response structure
    
    // Try different possible field names for ID
    const id = data.id || data.volunteerId || data.userId || null;
    console.log("Extracted volunteer ID:", id); // DEBUG: See what ID we got
    
    const { firstName, lastName, institute, about, imageUrl } = data;
    
    const result = { 
      firstName, 
      lastName, 
      institute, 
      about, 
      imageUrl, 
      id 
    };
    
    console.log("Final volunteer data:", result); // DEBUG: See final processed data
    return result;
  } catch (error) {
    console.error("Error fetching volunteer data:", error);
    return null;
  }
}

// Organization details - UPDATED: No longer throws errors
export async function getOrganizationDetails(username: string): Promise<PublicFeedOrganizationDetails | null> {
  try {
    const res = await fetch(`http://localhost:8080/api/public/organizations/by-username/${username}`);
    if (!res.ok) {
      console.log(`Organization not found: ${username}`);
      return null; // Return null instead of throwing
    }
    const json = await res.json();
    const { name, institute, description, isVerified, imageUrl, id } = json.data;
    return { name, institute, description, isVerified, imageUrl, id };
  } catch (error) {
    console.error("Error fetching organization data:", error);
    return null;
  }
}

// All organizations for feed right sidebar
export async function getAllOrganizations(): Promise<any[]> {
  try {
    const res = await fetch("http://localhost:8080/api/public/organizations");
    if (!res.ok) throw new Error("Failed to fetch organizations");
    const json = await res.json(); 
    return json.data.map((org: any) => ({
      id: org.id,
      name: org.name,
      imageUrl: org.imageUrl,
      isVerified: org.isVerified,
      institute: org.institute,
    }));
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return [];
  }
}

// Fetch followed organization IDs for a volunteer
export async function getFollowedOrganizationIds(volunteerId: number): Promise<number[]> {
  try {
    const res = await fetch(`http://localhost:8080/api/public/follow/${volunteerId}`);
    if (!res.ok) throw new Error("Failed to fetch followed organization IDs");
    const ids: number[] = await res.json(); // List of org IDs
    return ids;
  } catch (error) {
    console.error("Error fetching followed organizations:", error);
    return [];
  }
}

// Follow an organization
export async function followOrganization(volunteerId: number, organizationId: number): Promise<string> {
  try {
    const res = await fetch("http://localhost:8080/api/public/follow/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ volunteerId, organizationId }),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to follow organization");
    }
    return await res.text();
  } catch (error) {
    console.error("Error following organization:", error);
    throw error;
  }
}