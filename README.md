# Blood Donation Registry

A full-stack app to manage donors and their donations, with an eligibility rule
that blocks a new donation if it falls within 90 days of the donor's closest
prior donation.

## Tech Stack
- **Backend:** Spring Boot 3, Spring Data JPA, Spring Security, H2 (in-memory database)
- **Frontend:** React (Vite), plain CSS

## Prerequisites
- Java 21
- Node.js 18+
- Maven (or use the included `./mvnw` wrapper — no separate install needed)

## Running the Backend
```bash
cd backend
./mvnw spring-boot:run
```
Runs on `http://localhost:8080`.

H2 console (to inspect tables): `http://localhost:8080/h2-console`
JDBC URL: `jdbc:h2:mem:blood_donation_registry`, user `sa`, no password.

## Running the Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`.

## Running with Docker (backend only)
```bash
cd backend
docker build -t blood-donation-backend .
docker run -p 8080:8080 blood-donation-backend
```
The frontend is not containerized in this project — it runs separately via `npm run dev`.

**Note:** rebuild the image (`docker build ...`) any time backend Java files change.
Frontend-only changes never require a rebuild, since the image only packages the backend.

## Running Backend Tests
```bash
cd backend
./mvnw test
```
Covers the eligibility logic in `DonationServiceTest`, including boundary
conditions (89 vs. 90 vs. 91 days), first-time donors, and backdated entries.

---

## Data Model
- **Donor** (parent): `id`, `name`, `bloodGroup`, `phone`
- **Donation** (child): `id`, `donationDate`, `quantity`, `location`, `donor` (foreign key)

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/donors` | Open | List all donors |
| GET | `/api/donors/{id}` | Open | Get one donor |
| POST | `/api/donors` | Required | Create a donor |
| PUT | `/api/donors/{id}` | Required | Update a donor |
| DELETE | `/api/donors/{id}` | Required | Delete a donor (cascades to their donations) |
| GET | `/api/donors/{donorId}/donations?page=0&size=5` | Open | Paginated donations for a donor |
| GET | `/api/donors/{donorId}/donations/count` | Open | Count of a donor's donations |
| GET | `/api/donations/{id}` | Open | Get one donation |
| POST | `/api/donors/{donorId}/donations` | Required | Create a donation (enforces 90-day rule) |
| PUT | `/api/donations/{id}` | Required | Update a donation |
| DELETE | `/api/donations/{id}` | Required | Delete a donation |
| GET | `/api/auth/check` | Required | Verifies credentials (used by the login modal) |

## Eligibility Rule
A new donation is blocked (**HTTP 409**) if it falls fewer than 90 days after
the donor's **closest prior donation** — compared against the nearest donation
dated on or before the new one, not simply "today" or the donor's latest
record. A donor's first-ever donation is always allowed.

**Why "closest prior" and not "most recent overall":** if a donation is
backdated earlier than the donor's latest on-file record, comparing against
the latest record instead of the closest one before it can produce an
incorrect (even negative) day count. Eligibility is checked against whichever
past donation is nearest in time, before the new date.

**Known limitation:** eligibility is validated only against the closest prior
donation at insert time. Inserting a backdated donation does not retroactively
re-validate donations that come *after* it in the timeline. Full bidirectional
timeline consistency was considered out of scope for this assessment.

## Deleting a Donor with Existing Donations
Donations have a required (non-nullable) foreign key to their donor, so
deleting a donor with existing donation records cascades: their donations are
deleted first, then the donor. The frontend fetches the donation count before
deleting and asks for confirmation, naming the exact number of records that
will be removed.

## Validation
- **Donor:** name required; blood group must match `A+/A-/B+/B-/AB+/AB-/O+/O-`; phone must be exactly 10 digits.
- **Donation:** date required and cannot be in the future; quantity required and must be ≥ 1; location required.
- Malformed JSON or wrong field types (e.g. an unparseable date) are caught separately from field validation failures, both returning 400 with a clear message.

## Error Handling
| Status | Meaning |
|---|---|
| 400 | Invalid input — validation failure or malformed request body |
| 401 | Missing or incorrect credentials on a write operation |
| 404 | Donor or donation not found |
| 409 | Donation blocked by the 90-day eligibility rule |
| 500 | Unexpected server error |

All error responses are structured JSON (`timestamp`, `status`, `message`, and
`errors` for field-level validation failures) via a global exception handler,
not raw stack traces.

## Authentication
Write operations (POST/PUT/DELETE) require HTTP Basic authentication.
GET requests are open to everyone.

- **Backend:** one in-memory user (`admin` / `admin123`), password bcrypt-hashed via Spring Security.
- **Frontend:** no hardcoded credentials. Attempting a write while logged out
  triggers a login modal automatically (on receiving a 401). The modal verifies
  credentials against `GET /api/auth/check` before storing them, showing an
  inline "Incorrect username or password" message on failure instead of
  silently closing. Credentials are kept in memory only (never persisted to
  localStorage/disk) and are cleared on page refresh.
- A "Login successful" toast confirms a successful sign-in and fades after 5 seconds.

**Known limitation:** this is HTTP Basic Auth with a single shared credential,
appropriate for the scope of this assessment ("auth on write operations").
A production system would use per-user accounts stored in a database and a
token-based scheme (e.g. JWT) rather than one hardcoded in-memory user.

## Frontend Notes
- No routing library or state management library — plain `useState`/`useEffect`,
  since the app is a single page with two related panels (Donors, Donations).
- `api.js` is framework-agnostic (no React imports); it exposes a small
  publish/subscribe pattern (`onUnauthorized`, `onAuthSuccess`) so React
  components can react to auth events without `api.js` depending on React.
- Donation list pagination is wired to the backend's `Page<Donation>` response
  (`content`, `totalPages`) with Previous/Next controls.

## Project Structure
```
backend/
  src/main/java/com/registry/blooddonationbackend/
    donor/        Donor entity, repository, service, controller
    donation/      Donation entity, repository, service, controller, eligibility logic
    common/        Global exception handler, Spring Security config, auth-check endpoint
  src/test/java/.../donation/DonationServiceTest.java
  Dockerfile
frontend/
  src/
    api.js          All backend calls, auth state, event callbacks
    App.jsx          Top-level layout, auth modal + toast wiring
    DonorList.jsx     Donor CRUD UI
    DonationList.jsx  Donation CRUD UI, pagination
    AuthModal.jsx     Login card shown on 401
    App.css          Design tokens and component styles
```
