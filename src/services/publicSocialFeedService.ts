import { Post } from "./types";
import { arrayToDate, getTimeAgoFromDate } from "./utils";
import { PublicFeedOrganizationDetails, PublicFeedVolunteerDetails } from "./types";

export async function getAllPublicPosts(): Promise<Post[]>{
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
    return[];
}
}

// Volunteer details
export async function getVolunteerDetails(username: string){
  try {
    const res = await fetch(`http://localhost:8080/api/public/volunteers/${username}`);
    if (!res.ok) throw new Error("Failed to fetch volunteer data");

    const data = await res.json();
    const { firstName, lastName, institute, about } = data;

    return { firstName, lastName, institute, about };
  } catch (error) {
    console.error("Error fetching volunteer data:", error);
    return null;
  }
}

// Organization details
export async function getOrganizationDetails(username: string){
  try{
    const res = await fetch(`http://localhost:8080/api/public/organizations/by-username/${username}`);
    if (!res.ok) throw new Error("Failed to fetch organization data");

    const json = await res.json();
    const { name, institute, description, isVerified, imageUrl } = json.data;

    return { name, institute, description, isVerified, imageUrl };
  } catch (error) {
    console.error("Error fetching organization data:", error);
    return null;
  }
}