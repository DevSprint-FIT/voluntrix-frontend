export interface EventCreateType {
  eventTitle: string;
  eventDescription: string;
  eventLocation: string;
  eventStartDate: string;
  eventEndDate: string;
  eventTime: string;
  eventImageUrl: string;
  eventType: string;
  eventVisibility: string;
  eventStatus: string;
  sponsorshipEnabled: boolean;
  donationEnabled: boolean;
  sponsorshipProposalUrl: string | null;
  donationGoal: number | null;
  categories: { categoryId: number }[];
  eventHostId: number;
  organizationId: number | null;
}
