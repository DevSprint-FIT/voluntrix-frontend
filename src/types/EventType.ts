export type EventType = {
  eventId: number;
  eventTitle: string;
  eventDescription: string;
  eventLocation: string;
  eventDate: string;
  eventTime: string;
  eventImageUrl: string;
  eventType: string;
  eventVisibility: string;
  eventStatus: string;
  sponsorshipEnabled: boolean;
  donationEnabled: boolean;
  categories: { categoryId: number; categoryName: string }[];
  organizer: string;
};
