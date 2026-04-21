export enum ServiceType {
  TENNIS = 'TENNIS',
  CRICKET = 'CRICKET',
  MEETING_ROOM = 'MEETING_ROOM',
}

export interface Booking {
  id: string;
  userId: string;
  startTime: string;
  endTime: string;
  serviceType: ServiceType;
}
