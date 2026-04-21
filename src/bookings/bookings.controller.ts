import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './models/booking.model';
import { BookingsService } from './bookings.service';

@ApiTags('bookings')
@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('bookings')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Booking created successfully' })
  @ApiBadRequestResponse({ description: 'INVALID_REQUEST or INVALID_SERVICE' })
  @ApiConflictResponse({ description: 'SLOT_UNAVAILABLE — slot already booked' })
  createBooking(@Body() createBookingDto: CreateBookingDto): Booking {
    return this.bookingsService.createBooking(createBookingDto);
  }

  @Get()
  @Header('Content-Type', 'text/html')
  getHomePage(): string {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Smart Booking API</title>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
  </head>
  <body class="bg-light">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h1 class="h4 mb-3">Smart Booking API</h1>
              <p class="text-muted">Create a booking with the form below.</p>
              <form id="bookingForm" class="row g-3">
                <div class="col-12">
                  <label for="user_id" class="form-label">User ID</label>
                  <input id="user_id" name="user_id" type="text" class="form-control" placeholder="user-1" required />
                </div>
                <div class="col-12">
                  <label for="service_type" class="form-label">Service Type</label>
                  <select id="service_type" name="service_type" class="form-select" required>
                    <option value="consultation">consultation</option>
                    <option value="demo">demo</option>
                    <option value="support">support</option>
                  </select>
                </div>
                <div class="col-12">
                  <label for="date" class="form-label">Date (YYYY-MM-DD)</label>
                  <input id="date" name="date" type="date" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label for="time_slot" class="form-label">Time Slot (HH:MM)</label>
                  <input id="time_slot" name="time_slot" type="time" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label for="duration_minutes" class="form-label">Duration</label>
                  <select id="duration_minutes" name="duration_minutes" class="form-select" required>
                    <option value="30">30 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                </div>
                <div class="col-12 d-grid">
                  <button type="submit" class="btn btn-primary">Create Booking</button>
                </div>
              </form>
              <hr />
              <pre id="result" class="bg-dark text-light p-3 rounded small mb-0">Submit the form to see response...</pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <script>
      const form = document.getElementById('bookingForm');
      const result = document.getElementById('result');

      form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const payload = {
          user_id: formData.get('user_id'),
          service_type: formData.get('service_type'),
          date: formData.get('date'),
          time_slot: formData.get('time_slot'),
          duration_minutes: Number(formData.get('duration_minutes')),
        };

        try {
          const response = await fetch('/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          const data = await response.json();
          result.textContent = JSON.stringify(
            { status: response.status, data },
            null,
            2,
          );
        } catch (error) {
          result.textContent = JSON.stringify(
            { status: 'NETWORK_ERROR', message: error.message },
            null,
            2,
          );
        }
      });
    </script>
  </body>
</html>`;
  }
}
