export type EventApplicAndVolType = {
  id: number;
  eventId: number;
  volunteerId: number;
  volunteerName: string;
  description: string;
  contributionArea: 'DESIGN' | 'EDITORIAL' | 'LOGISTICS' | 'PROGRAM' | string;
  applicationStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
};
