export type OrganizationType = {
  id: number;
  name: string;
  username: string;
  institute: string;
  email: string;
  phone: string;
  accountNumber: string;
  isVerified: boolean;
  followerCount: number;
  joinedDate: [number, number, number, number, number, number, number]; // [year, month, day, hour, minute, second, nanoseconds]
  description: string;
  website: string;
  bankName: string;
  imageUrl: string;
  facebookLink: string | null;
  linkedinLink: string | null;
  instagramLink: string | null;
}
