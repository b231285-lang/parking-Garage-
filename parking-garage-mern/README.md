# ParkPilot — MERN Smart Parking Garage

A full-stack parking attendant product with MongoDB persistence, JWT registration/login, REST APIs, a React UI, searchable/paginated/sortable history, messy rate-card import, nightly auto-close via `/clock`, and valet plate transfer.

## Stack
- React + Vite
- Node.js + Express (ES modules)
- MongoDB + Mongoose
- JWT + bcryptjs

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
Set `MONGO_URI` and a strong `JWT_SECRET` in `.env`. Backend runs on `http://localhost:5000`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Optional frontend `.env`: `VITE_API_URL=http://localhost:5000/api`.

After registering/logging in, call `POST /api/parking/seed` once to create sample spots.

## Authentication
Protected parking routes require:
```http
Authorization: Bearer <JWT_TOKEN>
```

## REST API endpoints

### Auth
- `POST /api/auth/register` — register `{ name, email, password }`
- `POST /api/auth/login` — login `{ email, password }`
- `GET /api/health` — health check (public)

### Parking (JWT protected)
- `POST /api/parking/seed` — create sample spots for the logged-in garage user
- `POST /api/parking/check-in` — check in `{ plateNumber, vehicleType }`
- `POST /api/parking/check-out` — check out and bill `{ plateNumber }`
- `POST /api/parking/transfer` — valet hand-off `{ fromPlate, toPlate }`; keeps spot and entry time
- `POST /api/parking/clock` — nightly job; optional `{ now: ISO_DATE }`; closes active sessions parked at least 24 hours
- `POST /api/parking/rates/import` — import messy rows `{ rows: [...] }`; invalid/junk rows are ignored
- `GET /api/parking/rates` — cleaned rates for current garage
- `GET /api/parking/spots` — spots with `page`, `limit`, `sort`, `order`, optional `type`
- `GET /api/parking/spots/ev` — currently free EV spots
- `GET /api/parking/vehicle/:plate` — find records by plate
- `GET /api/parking/history` — records with `page`, `limit`, `search`, `sort`, `order`

## Rate-card import
Accepted aliases include `spotType`/`type`, `firstHour`/`first_hour`, `extraHour`/`extra_hour`, and `dailyCap`/`daily_cap`. Rows with unknown spot types, missing values, non-numeric values, or negative prices are discarded. Rates are stored per garage and spot type.

Fee rules: part-hours round up; first hour uses `firstHour`; additional hours use `extraHour`; final amount is capped at `dailyCap`.

## Debugging
- `401`: login and send the Bearer token.
- MongoDB connection error: verify MongoDB is running and `MONGO_URI` is correct.
- `409 No compatible spot`: seed spots or add more available spots.
- Use `POST /api/parking/clock` with a fixed ISO `now` in tests for deterministic auto-close behavior.

## Next features
1. Multi-garage admin roles and staff permissions.
2. Payment gateway and printable/email receipts.
3. Real-time occupancy updates using WebSockets.
