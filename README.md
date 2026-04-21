# Smart Booking API (NestJS Demo)

Minimal, demo-ready API with one feature:

- `POST /bookings` - Create booking with validation + business rules

Includes:

- NestJS + TypeScript
- `class-validator` validation
- In-memory storage (no DB)
- Swagger docs at `GET /api`
- Simple Bootstrap HTML form at `GET /`
- Jest unit + e2e tests

## Quick Start

```bash
npm install
npm run start:dev
```

Open:

- `http://localhost:3000/` (HTML UI)
- `http://localhost:3000/api` (Swagger)

## API

### Create Booking

`POST /bookings`

Request body:

```json
{
  "userId": "user-1",
  "startTime": "2026-04-22T10:00:00.000Z",
  "endTime": "2026-04-22T11:00:00.000Z",
  "serviceType": "TENNIS"
}
```

`serviceType` enum:

- `TENNIS`
- `CRICKET`
- `MEETING_ROOM`

## Business Rules

1. Booking must not overlap with any existing booking
2. A user can have at most 3 bookings per day
3. Booking must be within working hours `09:00-18:00` (UTC)
4. `startTime` must be before `endTime`
5. Minimum booking duration is 30 minutes

## Example cURL

```bash
curl -X POST http://localhost:3000/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-1",
    "startTime": "2026-04-22T10:00:00.000Z",
    "endTime": "2026-04-22T11:00:00.000Z",
    "serviceType": "TENNIS"
  }'
```

## Test Commands

```bash
npm run test
npm run test:e2e
npm run build
```

## 2-Minute Live Demo Script

1. Start app: `npm run start:dev`
2. Show UI: `GET /` and submit a valid booking
3. Show API docs: `GET /api` and inspect request schema
4. Create an overlapping booking to show clear `400` error
5. Mention core rules enforced in service layer
6. Run tests quickly: `npm run test`

## Notes

- No authentication
- No database
- Designed for Spec -> Code -> Validation -> AI Review demos
