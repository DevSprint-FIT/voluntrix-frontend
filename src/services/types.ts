export type MediaType = "TEXT" | "IMAGE" | "VIDEO";

export interface Post {
  id: number;
  content: string;
  mediaUrl?: string;
  mediaType: MediaType;
  mediaSizeInBytes?: number;
  timeAgo?: string;
  createdAt: string;
  updatedAt: string;
  organizationName: string;
  organizationImageUrl: string;
  impressions?: number;
  shares?: number;
}

export interface Organization {
  id: number;
  name: string;
  imageUrl?: string;
  followerCount: number;
  institute: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}



