export type SponsorshipRequestType = {
  requestId: number;
  status: 'APPROVED' | 'REJECTED' | 'PENDING';
  sponsorId: number;
  sponsorshipId: number;
  jobTitle: string;
  sponsorshipName: string;
  company: string;
};