import { BadRequestException, ConflictException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { ServiceType } from './models/booking.model';

describe('BookingsService', () => {
  let service: BookingsService;

  const FUTURE_DATE = '2099-06-15';

  beforeEach(() => {
    service = new BookingsService();
  });

  // AC-1: Valid request returns booking_id and status confirmed
  it('AC-1: returns booking_id and status confirmed for valid request', () => {
    const result = service.createBooking({
      user_id: 'user-1',
      service_type: ServiceType.CONSULTATION,
      date: FUTURE_DATE,
      time_slot: '10:00',
      duration_minutes: 60,
    });

    expect(result.booking_id).toBeDefined();
    expect(result.status).toBe('confirmed');
    expect(result.user_id).toBe('user-1');
    expect(result.service_type).toBe(ServiceType.CONSULTATION);
    expect(result.date).toBe(FUTURE_DATE);
    expect(result.time_slot).toBe('10:00');
    expect(result.duration_minutes).toBe(60);
  });

  // AC-2: Already booked slot returns 409 SLOT_UNAVAILABLE
  it('AC-2: throws ConflictException (409) when slot overlaps an existing booking', () => {
    service.createBooking({
      user_id: 'user-1',
      service_type: ServiceType.CONSULTATION,
      date: FUTURE_DATE,
      time_slot: '10:00',
      duration_minutes: 60,
    });

    expect(() =>
      service.createBooking({
        user_id: 'user-2',
        service_type: ServiceType.DEMO,
        date: FUTURE_DATE,
        time_slot: '10:30',
        duration_minutes: 30,
      }),
    ).toThrow(ConflictException);
  });

  // AC-2 edge: same slot booked simultaneously — first wins, second gets 409
  it('AC-2 edge: non-overlapping slot on same day succeeds', () => {
    service.createBooking({
      user_id: 'user-1',
      service_type: ServiceType.CONSULTATION,
      date: FUTURE_DATE,
      time_slot: '10:00',
      duration_minutes: 30,
    });

    const result = service.createBooking({
      user_id: 'user-2',
      service_type: ServiceType.DEMO,
      date: FUTURE_DATE,
      time_slot: '10:30',
      duration_minutes: 30,
    });

    expect(result.status).toBe('confirmed');
  });

  // Edge case: date in the past returns 400 INVALID_REQUEST
  it('edge: throws BadRequestException for past date', () => {
    expect(() =>
      service.createBooking({
        user_id: 'user-1',
        service_type: ServiceType.SUPPORT,
        date: '2020-01-01',
        time_slot: '10:00',
        duration_minutes: 30,
      }),
    ).toThrow(BadRequestException);
  });
});
