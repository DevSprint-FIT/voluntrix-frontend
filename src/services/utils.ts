import { Post } from "@/services/types"

// Utility: Convert array [YYYY, MM, DD, HH, mm, ss, ns] to JS Date
export function arrayToDate(arr: number[]): Date {
    if (!Array.isArray(arr) || arr.length < 6) {
      throw new Error("Invalid date array format");
    }
    return new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
  }
  
  // Format time ago from Date
  export function getTimeAgoFromDate(date: Date): string {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }
  export function calculateMetrics(posts: Post[]) {
    // Get the most recent month that has posts
    const sortedDates = posts
      .map(p => new Date(p.createdAt))
      .sort((a, b) => b.getTime() - a.getTime());
    
    const mostRecentDate = sortedDates[0] || new Date();
    const startOfThisMonth = new Date(mostRecentDate.getFullYear(), mostRecentDate.getMonth(), 1);
    const startOfLastMonth = new Date(startOfThisMonth);
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
  
    const thisMonthPosts = posts.filter(p => {
      const postDate = new Date(p.createdAt);
      return postDate >= startOfThisMonth && postDate < new Date(startOfThisMonth.getFullYear(), startOfThisMonth.getMonth() + 1, 1);
    });
    
    const lastMonthPosts = posts.filter(p => {
      const postDate = new Date(p.createdAt);
      return postDate >= startOfLastMonth && postDate < startOfThisMonth;
    });
  
    const thisMonthCount = thisMonthPosts.length;
    const lastMonthCount = lastMonthPosts.length;
  
    const thisMonthImpressions = thisMonthPosts.reduce((sum, p) => sum + (p.impressions || 0), 0);
    const lastMonthImpressions = lastMonthPosts.reduce((sum, p) => sum + (p.impressions || 0), 0);
  
    const thisMonthShares = thisMonthPosts.reduce((sum, p) => sum + (p.shares || 0), 0);
    const lastMonthShares = lastMonthPosts.reduce((sum, p) => sum + (p.shares || 0), 0);
  
    function getGrowthPercentage(prev: number, current: number): string {
      if (prev === 0) return current > 0 ? "+100%" : "0%";
      const growth = ((current - prev) / prev) * 100;
      return `${growth > 0 ? "+" : ""}${growth.toFixed(1)}%`;
    }
  
    const postGrowth = getGrowthPercentage(lastMonthCount, thisMonthCount);
    const impressionsGrowth = getGrowthPercentage(lastMonthImpressions, thisMonthImpressions);
    const sharesGrowth = getGrowthPercentage(lastMonthShares, thisMonthShares);
  
    return {
      totalPosts: thisMonthCount,
      postGrowth,
      totalImpressions: thisMonthImpressions,
      impressionsGrowth,
      totalShares: thisMonthShares,
      sharesGrowth,
    };
  }

  export function calculateTotalMediaSize(posts: Post[]): number {
    const totalBytes = posts.reduce((sum, post) => sum + (post.mediaSizeInBytes || 0), 0);
    const bytesInGB = 1024 * 1024 * 1024;
    return totalBytes / bytesInGB;
  }
  
  
  
  