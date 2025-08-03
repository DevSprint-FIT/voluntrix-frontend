import { Post } from "./types";
import { arrayToDate, getTimeAgoFromDate } from "./utils";
import { PublicFeedOrganizationDetails, PublicFeedVolunteerDetails } from "./types";
import authService from "./authService"; 

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
    
    const res = await fetch(`${BASE_URL}/api/volunteers/me`, {
      headers: authService.getAuthHeaders()
    });
    
    if (!res.ok) {
      console.log(`Volunteer API returned ${res.status}: ${res.statusText}`);
      return null;
    }
    
    const data = await res.json();
    
    
    const { 
      volunteerId, 
      fullName, 
      institute, 
      about, 
      profilePictureUrl 
    } = data;
    
    // Split fullName into firstName and lastName
    const nameParts = fullName?.split(' ') || ['', ''];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    return { 
      id: volunteerId,  // Map volunteerId to id
      firstName, 
      lastName, 
      institute: institute || "", 
      about: about || "", 
      imageUrl: profilePictureUrl,  // Map profilePictureUrl to imageUrl
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAllOrganizations(): Promise<any[]> {
  try {
    const BASE_URL = getBaseUrl();
    const res = await fetch(`${BASE_URL}/api/organizations/all`, {
      headers: authService.getAuthHeaders()
    });
    
    if (!res.ok) throw new Error("Failed to fetch organizations");
    
    const json = await res.json();
    const organizations = json.data || json;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    const res = await fetch(`${BASE_URL}/api/follow/followed-organizations`, {
      headers: authService.getAuthHeaders(),
      
      signal: AbortSignal.timeout(10000) 
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      let errorData;
      
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      
      console.error(`Follow API returned ${res.status}: ${res.statusText}`, errorData);
      
      if (res.status === 500) {
        console.error("Server error when fetching followed organizations. Backend error:", errorData.message || errorText);
        console.warn("Returning empty followed organizations list due to server error");
        return [];
      } else if (res.status === 403) {
        console.error("Access denied. User might not have permission to follow organizations.");
        throw new Error("You don't have permission to view followed organizations.");
      } else if (res.status === 401) {
        console.error("Authentication failed. Check JWT token.");
        throw new Error("Please log in to view followed organizations.");
      } else if (res.status === 404) {
        console.warn("Follow endpoint not found. User might not have followed any organizations yet.");
        return [];
      }
      
      throw new Error(`Failed to fetch followed organization IDs: ${res.status} ${errorData.message || res.statusText}`);
    }
    
    const ids: number[] = await res.json();
    console.log("Follow API response:", ids); // Debug log
    
    if (!Array.isArray(ids)) {
      console.warn("Expected array but got:", typeof ids, ids);
      return [];
    }
    
    const validIds = ids
      .map(id => typeof id === 'number' ? id : parseInt(id, 10))
      .filter(id => !isNaN(id));
    
    console.log("Successfully fetched followed organization IDs:", validIds);
    return validIds;
    
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error("Request timed out when fetching followed organizations");
      return [];
    }
    
    console.error("Error fetching followed organizations:", error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error("Network error - API might be down:", error.message);
    }
    
    return []; 
  }
}


export async function followOrganization(organizationId: number, retryCount = 0): Promise<string> {
  const MAX_RETRIES = 2;
  
  try {
    const BASE_URL = getBaseUrl();
    console.log("Attempting to follow organization:", organizationId, retryCount > 0 ? `(retry ${retryCount})` : '');
    
   
    const res = await fetch(`${BASE_URL}/api/follow/`, {
      method: "POST",
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ organizationId }),
      // Add timeout
      signal: AbortSignal.timeout(10000) 
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      let errorData;
      
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      
      console.error(`Follow POST API returned ${res.status}: ${res.statusText}`, errorData);
      
      
      if (res.status === 500) {
        
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying follow request (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); 
          return followOrganization(organizationId, retryCount + 1);
        }
        throw new Error("Server error occurred. Please try again later.");
      } else if (res.status === 403) {
        throw new Error("You don't have permission to follow organizations.");
      } else if (res.status === 401) {
        throw new Error("Please log in to follow organizations.");
      } else if (res.status === 400) {
        throw new Error("Invalid request. Please check the organization ID.");
      } else if (res.status === 409) {
        throw new Error("You are already following this organization.");
      } else {
        throw new Error(`Failed to follow organization: ${errorData.message || res.statusText}`);
      }
    }
    
    const responseText = await res.text();
    console.log("Follow successful:", responseText);
    return responseText;
    
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error("Request timed out. Please check your connection and try again.");
    }
    
    console.error("Error following organization:", error);
    
    
    if (error instanceof TypeError && error.message.includes('fetch') && retryCount < MAX_RETRIES) {
      console.log(`Network error, retrying (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      return followOrganization(organizationId, retryCount + 1);
    }
    
    throw error; 
  }
}