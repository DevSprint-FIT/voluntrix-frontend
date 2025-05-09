import { Post } from "./types";
import { arrayToDate, getTimeAgoFromDate } from "./utils";

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