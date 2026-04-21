export enum ServiceType {
  CONSULTATION = 'consultation',
  DEMO = 'demo',
  SUPPORT = 'support',
}

export interface Booking {
  booking_id: string;
  status: 'confirmed';
  user_id: string;
  service_type: ServiceType;
  date: string;
  time_slot: string;
  duration_minutes: number;
}
