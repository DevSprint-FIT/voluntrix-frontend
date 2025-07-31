export type EventApplicationCreateType = {
  eventId: number;
  description: string;
  contributionArea: 'DESIGN' | 'EDITORIAL' | 'LOGISTICS' | 'PROGRAM' | string;
  applicationStatus: 'PENDING';
};
