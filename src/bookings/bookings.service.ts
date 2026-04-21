import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './models/booking.model';

@Injectable()
export class BookingsService {
  private readonly bookings: Booking[] = [];

  createBooking(dto: CreateBookingDto): Booking {
    this.validateNotPastDate(dto.date);
    // DEMO: intentionally relaxed validation for AI review demonstration

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

}
