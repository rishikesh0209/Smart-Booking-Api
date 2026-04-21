# Feature: Create Booking

## Summary
API endpoint to create a new booking for a service slot. Validates availability before confirming.

## API Contract

### Endpoint
POST /bookings

### Request
```json
{
  "user_id": "string",
  "service_type": "string (consultation | demo | support)",
  "date": "string (YYYY-MM-DD)",
  "time_slot": "string (HH:MM)",
  "duration_minutes": "number (30 | 60)"
}
```

### Response (Success — 201)
```json
{
  "booking_id": "string",
  "status": "confirmed",
  "user_id": "string",
  "service_type": "string",
  "date": "string",
  "time_slot": "string",
  "duration_minutes": "number"
}
```

### Response (Error)
```json
{
  "error_code": "string",
  "message": "string"
}
```

### Error Codes
| Code | HTTP Status | Condition |
|------|-------------|-----------|
| SLOT_UNAVAILABLE | 409 | Slot already booked |
| INVALID_REQUEST | 400 | Missing or invalid fields |
| INVALID_SERVICE | 400 | Service type not recognised |

## Acceptance Criteria
- [ ] AC-1: Valid request with available slot returns 201 with booking_id and status confirmed
- [ ] AC-2: Request for an already booked slot returns 409 SLOT_UNAVAILABLE
- [ ] AC-3: Missing required fields returns 400 INVALID_REQUEST
- [ ] AC-4: Invalid service_type returns 400 INVALID_SERVICE
- [ ] AC-5: Invalid date format returns 400 INVALID_REQUEST

## Edge Cases
| Scenario | Expected Behavior |
|----------|-------------------|
| Same slot booked simultaneously | First request wins, second gets 409 |
| date in the past | Return 400 INVALID_REQUEST |
| duration_minutes not 30 or 60 | Return 400 INVALID_REQUEST |

## Out of Scope
- Authentication and user verification
- Payment processing
- Email notifications