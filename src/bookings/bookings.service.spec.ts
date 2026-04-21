import { BadRequestException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { ServiceType } from './models/booking.model';

describe('BookingsService', () => {
  let service: BookingsService;

  beforeEach(() => {
    service = new BookingsService();
  });

  it('rejects overlapping bookings across users', () => {
    service.createBooking({
      userId: 'user-1',
      startTime: '2026-04-22T10:00:00.000Z',
      endTime: '2026-04-22T11:00:00.000Z',
      serviceType: ServiceType.TENNIS,
    });

    expect(() =>
      service.createBooking({
        userId: 'user-2',
        startTime: '2026-04-22T10:30:00.000Z',
        endTime: '2026-04-22T11:30:00.000Z',
        serviceType: ServiceType.CRICKET,
      }),
    ).toThrow(BadRequestException);
  });

  it('enforces max 3 bookings per user per day', () => {
    service.createBooking({
      userId: 'user-1',
      startTime: '2026-04-22T09:00:00.000Z',
      endTime: '2026-04-22T09:30:00.000Z',
      serviceType: ServiceType.TENNIS,
    });
    service.createBooking({
      userId: 'user-1',
      startTime: '2026-04-22T10:00:00.000Z',
      endTime: '2026-04-22T10:30:00.000Z',
      serviceType: ServiceType.CRICKET,
    });
    service.createBooking({
      userId: 'user-1',
      startTime: '2026-04-22T11:00:00.000Z',
      endTime: '2026-04-22T11:30:00.000Z',
      serviceType: ServiceType.MEETING_ROOM,
    });

    expect(() =>
      service.createBooking({
        userId: 'user-1',
        startTime: '2026-04-22T12:00:00.000Z',
        endTime: '2026-04-22T12:30:00.000Z',
        serviceType: ServiceType.TENNIS,
      }),
    ).toThrow(BadRequestException);
  });

  it('rejects booking shorter than 30 minutes', () => {
    expect(() =>
      service.createBooking({
        userId: 'user-1',
        startTime: '2026-04-22T10:00:00.000Z',
        endTime: '2026-04-22T10:10:00.000Z',
        serviceType: ServiceType.TENNIS,
      }),
    ).toThrow(BadRequestException);
  });
});
