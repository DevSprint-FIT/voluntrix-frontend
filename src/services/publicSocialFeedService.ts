import { Post } from "./types";
import { arrayToDate, getTimeAgoFromDate } from "./utils";
import { PublicFeedOrganizationDetails, PublicFeedVolunteerDetails } from "./types";
import authService from "./authService"; // Import the auth service

// Get API base URL from environment variable
const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
};

export async function getAllPublicPosts(): Promise<Post[]> {
  try {
    const BASE_URL = getBaseUrl();
    const res = await fetch(`${BASE_URL}/api/public/posts/all`, {
      headers: authService.getAuthHeaders()
    });
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

// Get current volunteer information from JWT token
export async function getCurrentVolunteerDetails(): Promise<PublicFeedVolunteerDetails | null> {
  try {
    const BASE_URL = getBaseUrl();
    const res = await fetch(`${BASE_URL}/api/volunteer/me`, {
      headers: authService.getAuthHeaders()
    });
    
    if (!res.ok) {
      console.log(`Volunteer API returned ${res.status}: ${res.statusText}`);
      return null;
    }
    
    const data = await res.json();
    const result = data.data || data;
    
    // Extract necessary fields
    const { id, firstName, lastName, institute, about, imageUrl } = result;
    
    return { 
      firstName, 
      lastName, 
      institute, 
      about: about || "", 
      imageUrl, 
      id 
    };
  } catch (error) {
    console.error("Error fetching volunteer data:", error);
    return null;
  }
}

// Get all volunteers (for admin purposes)
export async function getAllVolunteers(): Promise<PublicFeedVolunteerDetails[]> {
  try {
    const BASE_URL = getBaseUrl();
    const res = await fetch(`${BASE_URL}/api/public/volunteers/all`, {
      headers: authService.getAuthHeaders()
    });
    
    if (!res.ok) {
      console.log(`Volunteers API returned ${res.status}: ${res.statusText}`);
      return [];
    }
    
    const data = await res.json();
    return (data.data || data).map((volunteer: any) => ({
      id: volunteer.id,
      firstName: volunteer.firstName,
      lastName: volunteer.lastName,
      institute: volunteer.institute,
      about: volunteer.about || "",
      imageUrl: volunteer.imageUrl
    }));
  } catch (error) {
    console.error("Error fetching all volunteers:", error);
    return [];
  }
}

// Get current organization from JWT token
export async function getCurrentOrganizationDetails(): Promise<PublicFeedOrganizationDetails | null> {
  try {
    const BASE_URL = getBaseUrl();
    const res = await fetch(`${BASE_URL}/api/organizations/me`, {
      headers: authService.getAuthHeaders()
    });
    
    if (!res.ok) {
      console.log(`Organization API returned ${res.status}: ${res.statusText}`);
      return null;
    }
    
    const json = await res.json();
    const data = json.data || json;
    
    const { name, institute, description, isVerified, imageUrl, id } = data;
    return { name, institute, description, isVerified, imageUrl, id };
  } catch (error) {
    console.error("Error fetching organization data:", error);
    return null;
  }
}

// All organizations for feed right sidebar
export async function getAllOrganizations(): Promise<any[]> {
  try {
    const BASE_URL = getBaseUrl();
    const res = await fetch(`${BASE_URL}/api/organizations/all`, {
      headers: authService.getAuthHeaders()
    });
    
    if (!res.ok) throw new Error("Failed to fetch organizations");
    
    const json = await res.json();
    const organizations = json.data || json;
    
    return organizations.map((org: any) => ({
      id: org.id,
      name: org.name,
      imageUrl: org.imageUrl,
      isVerified: org.isVerified,
      institute: org.institute,
      followerCount: org.followerCount || 0,
    }));
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return [];
  }
}

// Fetch followed organization IDs for the authenticated user
export async function getFollowedOrganizationIds(): Promise<number[]> {
  try {
    const BASE_URL = getBaseUrl();
    const res = await fetch(`${BASE_URL}/api/follow`, {
      headers: authService.getAuthHeaders()
    });
    
    if (!res.ok) throw new Error("Failed to fetch followed organization IDs");
    const response = await res.json();
    const ids: number[] = response.data || response; // List of org IDs
    return ids;
  } catch (error) {
    console.error("Error fetching followed organizations:", error);
    return [];
  }
}

// Follow an organization using authenticated user
export async function followOrganization(organizationId: number): Promise<string> {
  try {
    const BASE_URL = getBaseUrl();
    const res = await fetch(`${BASE_URL}/api/follow`, {
      method: "POST",
      headers: authService.getAuthHeaders(),
      body: JSON.stringify({ organizationId }),
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