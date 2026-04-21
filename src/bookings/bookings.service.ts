import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './models/booking.model';

@Injectable()
export class BookingsService {
  private readonly bookings: Booking[] = [];
  private static readonly MAX_BOOKINGS_PER_DAY = 3;
  private static readonly MIN_DURATION_MS = 30 * 60 * 1000;
  private static readonly WORK_START_HOUR = 9;
  private static readonly WORK_END_HOUR = 18;

  createBooking(createBookingDto: CreateBookingDto): Booking {
    this.validateBookingRules(createBookingDto);

    const booking: Booking = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ...createBookingDto,
    };

    this.bookings.push(booking);
    return booking;
  }

  private validateBookingRules(createBookingDto: CreateBookingDto): void {
    const start = new Date(createBookingDto.startTime);
    const end = new Date(createBookingDto.endTime);

    if (start >= end) {
      throw new BadRequestException('startTime must be before endTime');
    }

    if (end.getTime() - start.getTime() < BookingsService.MIN_DURATION_MS) {
      throw new BadRequestException('Minimum booking duration is 30 minutes');
    }

    if (!this.isWithinWorkingHours(start, end)) {
      throw new BadRequestException(
        'Booking must be within working hours (09:00-18:00)',
      );
    }

    if (this.hasConflict(start, end)) {
      throw new BadRequestException('Booking time overlaps with an existing booking');
    }

    if (this.hasReachedDailyLimit(createBookingDto.userId, start)) {
      throw new BadRequestException('A user can have at most 3 bookings per day');
    }
  }

  private isWithinWorkingHours(start: Date, end: Date): boolean {
    const isSameDay =
      start.toISOString().split('T')[0] === end.toISOString().split('T')[0];
    if (!isSameDay) {
      return false;
    }

    const startMinutes = start.getUTCHours() * 60 + start.getUTCMinutes();
    const endMinutes = end.getUTCHours() * 60 + end.getUTCMinutes();

    return (
      startMinutes >= BookingsService.WORK_START_HOUR * 60 &&
      endMinutes <= BookingsService.WORK_END_HOUR * 60
    );
  }

  private hasConflict(start: Date, end: Date): boolean {
    return this.bookings.some((booking) => {
      const existingStart = new Date(booking.startTime);
      const existingEnd = new Date(booking.endTime);
      return start < existingEnd && end > existingStart;
    });
  }

  private hasReachedDailyLimit(userId: string, day: Date): boolean {
    const dayKey = day.toISOString().split('T')[0];
    const bookingsForDay = this.bookings.filter((booking) => {
      const bookingDay = new Date(booking.startTime).toISOString().split('T')[0];
      return booking.userId === userId && bookingDay === dayKey;
    });

    return bookingsForDay.length >= BookingsService.MAX_BOOKINGS_PER_DAY;
  }
}
