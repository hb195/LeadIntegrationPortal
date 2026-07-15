# Lead Distribution Portal

A lightweight lead capture form, a real-time internal tracking dashboard, and the backend that connects them.

```
[Web Form Submission]
        │
        ▼
[Backend Server] ──(WebSocket broadcast)──> [Internal Dashboard]
```

## Architecture

- **`client/`** — React app (Vite dev server, port `5173` by default). Two views, no router library: `/` renders the public `LeadForm`, `/dashboard` renders the internal `Dashboard`. They are fully decoupled — the dashboard never reads form state directly; it only learns about new leads via the WebSocket broadcast from the backend.
  Form: http://localhost:5173/
  Dashboard: http://localhost:5173/dashboard

- **`server/`** — Node + Express, single process. Serves the REST API and a `ws` WebSocket server on the same HTTP server/port.

```
server/src/
  server.js            # creates the HTTP server, attaches the WS server, starts listening (port 8080)
  app.js               # express app: cors, json body parsing, mounts /api/leads, centralized error handler
  constants/budget.js  # budget bucket enum, min/max value mapping, default status
  store/leadStore.js   # in-memory lead store (see Data Persistence below)
  middleware/
    validateLead.js    # request validation for POST /api/leads
    errorHandler.js    # ApiError class + centralized error-to-response handler
  routes/leads.routes.js # POST /api/leads, GET /api/leads
  ws/socketServer.js   # attaches ws server to the HTTP server, broadcast() helper

client/src/
  App.jsx              # path-based view toggle (/ -> LeadForm, /dashboard -> Dashboard)
  constants/budget.js  # mirrors the backend's budget bucket labels/min/max (duplicated intentionally, no shared package)
  services/
    api.js             # postLead(), getLeads() fetch wrappers
    socket.js          # native WebSocket connect helper (onOpen/onMessage/onClose)
  components/
    LeadForm/          # public lead capture form
    Dashboard/         # Dashboard.jsx (fetch + WS subscribe), LeadTable.jsx, AnalyticsBadges.jsx
```

## Running Locally

Two separate processes, both required, in separate terminals:

**Backend** (port `8080`):

```
cd server
npm install
npm start
```

**Frontend** (port `5173` by default):

```
cd client
npm install
npm run dev
```

Open `http://localhost:5173/` for the lead form, and `http://localhost:5173/dashboard` for the internal dashboard. The frontend calls the backend directly at `http://localhost:8080` (CORS-enabled, no proxy).

## Budget → Pipeline Value Mapping

The form only collects a budget **bucket**, not an exact figure, so the dashboard's "Estimated Pipeline Value" badge is a **range**, computed by summing each lead's bucket bounds (`server/src/constants/budget.js`, mirrored in `client/src/constants/budget.js`):

| Bucket key        | Form label        | Min     | Max      |
| ----------------- | ----------------- | ------- | -------- |
| `UNDER_10K`       | Under $10k        | $0      | $10,000  |
| `BETWEEN_10K_50K` | $10k-$50k         | $10,000 | $50,000  |
| `OVER_50K`        | Greater than $50k | $50,000 | $100,000 |

The `$100,000` ceiling for the open-ended "Greater than $50k" bucket is an assumed representative upper bound, not a hard limit collected from the form.

## Data Persistence

The backend stores all leads in a module-level in-memory array (`server/src/store/leadStore.js`) — there is no database or file-based persistence.

**All submitted leads are permanently lost whenever the server process restarts.** This is an accepted, intentional limitation for this project's scope, not a bug. (Mirrored as a code comment directly above the store's `leads` array.)

## Known Limitations / Out of Scope

- No authentication on the form or dashboard (public form, no user accounts specified).
- No lead status workflow beyond the fixed `"New"` status.
- WebSocket reconnect uses a fixed 3s retry delay with a full re-fetch of `GET /api/leads` on reconnect — no exponential backoff.
