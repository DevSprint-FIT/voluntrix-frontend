export type VolEventParticipationType = {
  eventId: number;
  volunteerId: number;
  volunteerName: string;
  contributionArea: "DESIGN" | "EDITORIAL" | "LOGISTICS" | "PROGRAM" | string;
};
