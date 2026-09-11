# BSF WhatsApp Service 📱🏋️

A dedicated production-grade backend service built for the **Black Stone Fitness (BSF) Gym Management Dashboard**. It manages live WhatsApp multi-device connections using [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys), authenticates gym requests using the **Firebase Admin SDK**, persists multi-device authentication securely on disk, and dispatches automated gym notifications (receipts, membership renewals, welcome greetings, and payment reminders).

---

## 🏗️ Architecture & Features

- **Live Baileys Multi-Device Connection**: Emits real, unaltered WhatsApp QR pairing tokens for gym owners to scan via *WhatsApp → Linked Devices → Link a Device*.
- **Firebase Authentication & RBAC**: Verifies Bearer ID tokens on every request and ensures administrators only access their assigned gym.
- **Safe Session State & Firestore Sync**: Updates `gyms/{gymId}` in Firestore with connection state and metadata without storing private authentication keys.
- **Multi-Tenant Session Isolation**: Maintains independent in-memory socket sessions and persistent `auth_info/{gymId}/` storage per gym.
- **Auto Reconnection & Session Restoration**: Restores existing valid credentials on service startup and handles transient disconnects with exponential backoff.
- **Docker-Ready**: Configured for container platforms (Google Cloud Run, AWS ECS, DigitalOcean, VPS) with persistent volume support.

---

## 📁 Project Structure

```
bsf-whatsapp-service/
├── src/
│   ├── server.ts                       # Express application entry point & lifecycle
│   ├── config/
│   │   └── firebase.ts                 # Firebase Admin SDK initialization & Firestore sync
│   ├── middleware/
│   │   └── authenticate.ts             # Firebase ID token verification & gym authorization
│   ├── routes/
│   │   └── whatsappRoutes.ts           # REST API endpoints (/connect, /status, /send, etc.)
│   ├── services/
│   │   ├── WhatsAppSessionManager.ts   # Baileys socket lifecycle & multi-file auth state
│   │   └── WhatsAppMessageService.ts   # Message formatting, normalization & dispatching
│   ├── utils/
│   │   └── logger.ts                   # Pino structured logger
│   └── types/
│       └── whatsapp.ts                 # TypeScript interfaces and connection types
├── auth_info/                          # Persistent Baileys auth directory (git-ignored)
│   └── .gitkeep
├── Dockerfile                          # Multi-stage production container build
├── .dockerignore
├── .gitignore
├── .env.example
├── tsconfig.json
├── package.json
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root of `bsf-whatsapp-service/` by copying `.env.example`:

```bash
cp .env.example .env
```

| Variable | Required | Description | Example |
| :--- | :--- | :--- | :--- |
| `PORT` | Optional | Port for Express server (Defaults to `3000`) | `3000` |
| `CORS_ORIGIN` | Required | Allowed origins for CORS (comma-separated) | `http://localhost:5173,https://your-dashboard.com` |
| `FIREBASE_PROJECT_ID` | Required | Firebase Project ID | `ai-studio-blackstonefitnes-a93222c5-daa2-49d9-99ae-07d8de06e932` |
| `FIREBASE_CLIENT_EMAIL`| Required | Firebase Service Account Email | `firebase-adminsdk@...iam.gserviceaccount.com` |
| `FIREBASE_PRIVATE_KEY` | Required | Firebase Service Account Private Key (with `\n`) | `"-----BEGIN PRIVATE KEY-----\n..."` |
| `LOG_LEVEL` | Optional | Logger level (`info`, `debug`, `warn`, `error`) | `info` |

---

## 🚀 Installation & Local Development

### 1. Install Dependencies

```bash
cd bsf-whatsapp-service
npm install
```

### 2. Run in Development Mode (Live Reloading)

```bash
npm run dev
```

The service will start on `http://localhost:3000`.

### 3. Build for Production

```bash
npm run build
```

### 4. Start Production Server

```bash
npm start
```

---

## 🧪 7-Step Local Testing & Verification Checklist

Follow this simple checklist to test the entire integration locally on your computer before deployment:

### Step 1: Starting the Server
1. Navigate to the service folder: `cd bsf-whatsapp-service`
2. Create your `.env` file: `cp .env.example .env`
3. Set `PORT=3001` (or your preferred local port if `3000` is used by the frontend dev server).
4. For quick local testing, you can set `ALLOW_DEV_BYPASS=true` in `.env`.
5. Run the dev server:
   ```bash
   npm run dev
   ```
6. Confirm the console output shows:
   ```
   [INFO] BSF WhatsApp Service is running on port 3001 [Environment: development]
   ```

### Step 2: Opening `/health`
Open your browser or run in your terminal:
```bash
curl http://localhost:3001/health
```
**Expected Output:**
```json
{
  "status": "ok",
  "service": "BSF WhatsApp Service",
  "uptime": 2.45,
  "timestamp": "2026-09-01T..."
}
```

### Step 3: Connecting the Existing BSF Dashboard
1. In your frontend React dashboard `.env` (or `.env.local`), configure:
   ```env
   VITE_WHATSAPP_API_URL=http://localhost:3001
   ```
2. In the dashboard, open **Settings → WhatsApp Automation** (or click **Connect WhatsApp** in the top navigation).
3. The dashboard makes a request to `GET /api/whatsapp/status` to check the current connection state.

### Step 4: Generating the QR
1. Click **"Connect WhatsApp"** or **"Generate QR Code"** in the BSF Dashboard UI (or trigger via curl):
   ```bash
   curl -X POST http://localhost:3001/api/whatsapp/connect \
     -H "Authorization: Bearer dev-token" \
     -H "Content-Type: application/json"
   ```
2. The Baileys socket generates a new multi-device QR pairing token.
3. The QR code appears:
   - In your **terminal console** (rendered via ASCII blocks for instant CLI scanning)
   - In the **BSF Dashboard UI** (rendered dynamically on the canvas)

### Step 5: Scanning the QR using WhatsApp Linked Devices
1. On your mobile phone, open **WhatsApp**.
2. Go to **Settings** (iOS) or tap the **Three Dots Menu** (Android).
3. Tap **Linked Devices** → **Link a Device**.
4. Scan the QR code displayed on your screen or in the terminal.

### Step 6: Confirming Status Becomes `connected`
1. The Baileys socket completes the multi-device handshake and encryption key exchange.
2. The server logs: `[INFO] Baileys WhatsApp connection successfully opened and authenticated!`.
3. Check the status endpoint:
   ```bash
   curl http://localhost:3001/api/whatsapp/status -H "Authorization: Bearer dev-token"
   ```
   **Expected Response:**
   ```json
   {
     "success": true,
     "status": "connected",
     "qr": null,
     "phoneNumber": "+919845012890",
     "connectedAt": "2026-09-01T..."
   }
   ```
4. The BSF dashboard indicator turns **Green (Connected)** and displays the linked phone number.
5. The session is safely saved to disk in `auth_info/bsf_mysuru_01/`. If you restart the server, the session automatically restores without requiring another scan.

### Step 7: Sending a Test Message
Dispatch a test message using curl or directly from the BSF dashboard's **"Send Test Message"** or **"Send Payment Receipt"** button:
```bash
curl -X POST http://localhost:3001/api/whatsapp/send \
  -H "Authorization: Bearer dev-token" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "9845012890",
    "message": "🏋️ *BLACK STONE FITNESS*\n\nHello! This is a test message from Black Stone Fitness WhatsApp Service."
  }'
```
**Expected Response:**
```json
{
  "success": true,
  "messageId": "3EB0ABC123456789",
  "recipient": "9845012890",
  "timestamp": "2026-09-01T..."
}
```
Check the recipient phone — the WhatsApp message arrives immediately!

---

## 📡 API Endpoint Reference

All WhatsApp endpoints require a valid Firebase ID token in the `Authorization` header:
`Authorization: Bearer <FIREBASE_ID_TOKEN>`

### 1. `POST /api/whatsapp/connect`
Initiates a new Baileys socket connection or returns an active session for the authenticated gym.

- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "status": "qr_ready",
    "sessionId": "bsf_mysuru_01"
  }
  ```

---

### 2. `GET /api/whatsapp/status`
Returns the current WhatsApp connection state and the exact live QR string when waiting for scan.

- **Headers**: `Authorization: Bearer <token>`
- **Response (QR Ready)**:
  ```json
  {
    "success": true,
    "status": "qr_ready",
    "qr": "2@4M/8a...uV4=,a8k3...==,849...",
    "phoneNumber": null,
    "connectedAt": null,
    "updatedAt": "2026-09-01T15:25:30.000Z"
  }
  ```
- **Response (Connected)**:
  ```json
  {
    "success": true,
    "status": "connected",
    "qr": null,
    "phoneNumber": "+919845012890",
    "connectedAt": "2026-09-01T15:26:00.000Z",
    "updatedAt": "2026-09-01T15:26:00.000Z"
  }
  ```

---

### 3. `POST /api/whatsapp/send`
Dispatches an automated gym receipt, reminder, or custom text message.

- **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "phoneNumber": "+91 98450 12890",
    "message": "🏋️ *BLACK STONE FITNESS*\n\nHello Rahul,\nYour fee payment of *₹2,500* (Receipt #BSF-2026-0042) is received.\nValid Till: *30-Sep-2026*."
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "messageId": "3EB0ABC123456789",
    "recipient": "+91 98450 12890",
    "timestamp": "2026-09-01T15:27:00.000Z"
  }
  ```

---

### 4. `POST /api/whatsapp/disconnect`
Closes the active socket, removes the session from memory, wipes credentials from `auth_info/{gymId}/`, and updates Firestore status to `disconnected`.

- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "WhatsApp session disconnected and authentication credentials cleared"
  }
  ```

---

## 🔐 Frontend Integration with BSF Dashboard

In your React frontend application, specify the URL to this backend service in `.env`:

```env
VITE_WHATSAPP_API_URL=http://localhost:3000
```

The frontend can render the exact Baileys QR code string on an HTML5 `<canvas>` using `qrcode`:

```tsx
import QRCode from 'qrcode';

// Inside component:
QRCode.toCanvas(canvasRef.current, statusResponse.qr, { width: 240 });
```

---

## 💾 Persistent Storage Requirements (`auth_info`)

Baileys persists encryption keys, noise keys, and authentication tokens in `auth_info/{gymId}/`.

### Critical Deployment Notes:
1. **Persistent Volume**: When deploying in Docker / Kubernetes / Cloud Run with Cloud Storage Volume Mount, mount a persistent volume to `/app/auth_info`.
2. **Security**: Never expose `auth_info/` or return files from it via HTTP endpoints.
3. **Restoration**: On container restart, the service checks `/app/auth_info` and automatically reconnects previously authenticated WhatsApp sessions without requiring another QR scan.

---

## 🐳 Docker Deployment

### 1. Build the Docker Image

```bash
docker build -t bsf-whatsapp-service:latest .
```

### 2. Run with Persistent Volume Mount

```bash
docker run -d \
  --name bsf-whatsapp \
  -p 3000:3000 \
  -v bsf_auth_volume:/app/auth_info \
  --env-file .env \
  bsf-whatsapp-service:latest
```
