# REASONING

## Design decisions

1. **Ownership isolation:** users represent separate garages in this version. Spots and rate cards are scoped to the authenticated user.
2. **Fee correctness:** the fee calculator receives a cleaned rate configuration. Duration is rounded up to the next hour, and the daily cap is applied after calculating the tiered amount.
3. **No double parking:** check-in atomically claims an unoccupied compatible spot with `findOneAndUpdate`. The record is created only after the spot is claimed; a failed record creation releases the spot.
4. **Messy rate cards:** import normalizes aliases, trims/cases spot types, converts numeric values, and rejects junk rows. Only cleaned rates are persisted.
5. **Automation:** `/clock` accepts an optional timestamp so tests can be deterministic. It closes every active session whose entry time is at least 24 hours before the clock timestamp and releases its spot.
6. **Valet transfer:** `/transfer` changes only the open session's plate. The same record, spot, and entry time remain in place.
7. **Search/pagination/sorting:** history and spots expose query parameters and whitelist sortable fields to avoid arbitrary Mongo query keys.

## Testing plan

- Register a new user and log in; use the returned JWT on protected endpoints.
- Seed spots and verify compact, standard, and EV allocation rules.
- Check in the same plate twice and verify a `409` response.
- Verify an EV cannot be allocated to a non-EV spot.
- Import valid rows mixed with unknown types, missing values, negative numbers, and non-numeric junk; verify only valid rows are saved.
- Check out sessions at 1 hour, 1 hour 1 minute, and multi-hour durations; verify rounding and daily cap behavior.
- Call `/clock` with a fixed timestamp and verify sessions at 24+ hours close and their spots become free.
- Transfer an active session and verify the new plate has the original spot and entry time; reject transfer to a plate with an active session.
- Verify history search, pagination, and sorting.

## Known operational considerations

For a production garage, payment status, audit events, database transactions, and a dedicated garage entity would be added. Concurrent check-in and spot allocation should be tested under load and strengthened with MongoDB transactions or an atomic occupancy reservation model.
