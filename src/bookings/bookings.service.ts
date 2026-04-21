import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './models/booking.model';

@Injectable()
export class BookingsService {
  private readonly bookings: Booking[] = [];

  createBooking(dto: CreateBookingDto): Booking {
    this.validateNotPastDate(dto.date);
    this.validateNoConflict(dto.date, dto.time_slot, dto.duration_minutes);

    const booking: Booking = {
      booking_id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      status: 'confirmed',
      user_id: dto.user_id,
      service_type: dto.service_type,
      date: dto.date,
      time_slot: dto.time_slot,
      duration_minutes: dto.duration_minutes,
    };

    this.bookings.push(booking);
    return booking;
  }

  private validateNotPastDate(date: string): void {
    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
      throw new BadRequestException('date cannot be in the past');
    }
  }

  private validateNoConflict(date: string, timeSlot: string, durationMinutes: number): void {
    const startMs = this.toUtcMs(date, timeSlot);
    const endMs = startMs + durationMinutes * 60 * 1000;

    const hasConflict = this.bookings.some((booking) => {
      const bStartMs = this.toUtcMs(booking.date, booking.time_slot);
      const bEndMs = bStartMs + booking.duration_minutes * 60 * 1000;
      return startMs < bEndMs && endMs > bStartMs;
    });

    if (hasConflict) {
      throw new ConflictException('Slot is already booked');
    }
  }

  private toUtcMs(date: string, timeSlot: string): number {
    return new Date(`${date}T${timeSlot}:00.000Z`).getTime();
  }
}
