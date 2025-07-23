export type EventApplicationCreateType = {
  eventId: number;
  volunteerId: number;
  description: string;
  contributionArea: 'DESIGN' | 'EDITORIAL' | 'LOGISTICS' | 'PROGRAM' | string;
  applicationStatus: 'PENDING';
};
