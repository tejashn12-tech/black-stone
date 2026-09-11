# BSF WhatsApp Service

A production-ready Node.js TypeScript microservice and integrated backend that provides live WhatsApp QR authentication and messaging for the **Black Stone Fitness (BSF) Gym Management Dashboard** using [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys) and Firebase Admin SDK.

---

## Features

- 🟢 **Live Real Baileys WhatsApp Connection**: Generates authentic WhatsApp Web pairing QR codes directly emitted from Baileys' `connection.update` event (zero fake/mock QRs).
- 🔐 **Multi-File Secure Auth Storage**: Stores and restores cryptographic session state in `auth_info/{gymId}/` without leaking credentials to the client.
- 🛡️ **Firebase Admin Authentication**: Verifies Firebase ID Tokens via `Authorization: Bearer <token>` and maps authenticated users directly to their assigned gym ID in Firestore.
- ⚡ **Auto-Reconnection & Crash Recovery**: Reconnects active gym sessions upon service reboot or network drops with exponential backoff and finite retry limits.
- 📨 **Direct Message Dispatch**: Normalizes international and Indian mobile numbers and dispatches WhatsApp messages with delivery acknowledgements.
- 📋 **Structured Pino Logging & Health Check**: Real-time structured logs with configurable levels.

---

## 1. Installation

Install all dependencies:

```bash
npm install
```

Required packages:
- `@whiskeysockets/baileys`
- `firebase-admin`
- `express`
- `cors`
- `pino`
- `dotenv`
- `tsx` & `typescript`

---

## 2. Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```env
PORT=3000
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgI...\n-----END PRIVATE KEY-----\n"
CORS_ORIGIN=https://your-frontend-domain.com
LOG_LEVEL=info
BAILEYS_LOG_LEVEL=warn
```

---

## 3. Firebase Admin Configuration

1. Go to **Google Cloud Console** / **Firebase Console** -> **Project Settings** -> **Service Accounts**.
2. Click **Generate New Private Key**.
3. Fill in `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` in your `.env`.
4. The service will verify all incoming `Authorization: Bearer <Firebase_ID_TOKEN>` headers against Firebase Auth.

---

## 4. Running Locally

### Development Mode
Runs with real-time TypeScript execution via `tsx` and integrated Vite frontend:

```bash
npm run dev
```

### Production Build & Run

```bash
# 1. Compile Vite frontend and bundle backend server
npm run build

# 2. Start production server
npm run start
```

---

## 5. API Endpoints

### Health Check
- `GET /health`
  - Returns service status:
  ```json
  {
    "status": "ok",
    "service": "BSF WhatsApp Service"
  }
  ```

### 1. Initiate WhatsApp Connection
- `POST /api/whatsapp/connect`
- **Header**: `Authorization: Bearer <Firebase_ID_TOKEN>`
- **Response**:
  ```json
  {
    "success": true,
    "status": "initializing",
    "sessionId": "bsf-mysuru"
  }
  ```

### 2. Check Connection Status / Poll QR
- `GET /api/whatsapp/status`
- **Header**: `Authorization: Bearer <Firebase_ID_TOKEN>`
- **Response** (When waiting for scan):
  ```json
  {
    "success": true,
    "status": "qr_ready",
    "qr": "2@m6L...",
    "phoneNumber": null,
    "updatedAt": "2026-09-02T12:00:00.000Z"
  }
  ```
- **Response** (When connected):
  ```json
  {
    "success": true,
    "status": "connected",
    "qr": null,
    "phoneNumber": "+919880397294",
    "updatedAt": "2026-09-02T12:05:00.000Z"
  }
  ```

### 3. Send WhatsApp Message
- `POST /api/whatsapp/send`
- **Header**: `Authorization: Bearer <Firebase_ID_TOKEN>`
- **Request Body**:
  ```json
  {
    "phoneNumber": "+91 98803 97294",
    "message": "Hello from Black Stone Fitness Mysuru! Your membership is active."
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "messageId": "3EB0...",
    "status": "sent"
  }
  ```

### 4. Disconnect WhatsApp Session
- `POST /api/whatsapp/disconnect`
- **Header**: `Authorization: Bearer <Firebase_ID_TOKEN>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "WhatsApp session disconnected successfully"
  }
  ```

---

## 6. Real WhatsApp Connection Workflow

```
BSF Dashboard
     ↓
Click "Connect WhatsApp"
     ↓
POST /api/whatsapp/connect
     ↓
Baileys starts live WhatsApp Web Socket
     ↓
Baileys emits real connection.update { qr }
     ↓
Backend stores latest QR in memory
     ↓
GET /api/whatsapp/status returns live QR string
     ↓
Frontend renders QR code dynamically
     ↓
Gym Admin scans using WhatsApp Linked Devices
     ↓
Baileys detects connection open
     ↓
Status updates to 'connected'
     ↓
Dashboard automatically displays 🟢 WhatsApp Connected
```

---

## 7. Security & Deployment Requirements

- **Auth State Protection**: The `auth_info/` directory holds session credentials and must never be exposed or committed to version control.
- **Stateless/Persistent Storage**: When deploying to container environments (such as Google Cloud Run or AWS ECS), attach a persistent volume to `auth_info/` or use cloud secret storage to retain paired WhatsApp sessions across container scaling.
- **Restricted CORS**: In production, configure `CORS_ORIGIN` with your exact dashboard domain URL.
