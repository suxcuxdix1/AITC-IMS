# ArmorTech IMS (Inventory Management System)

High-security, web-based inventory system for military-grade hardware.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Express (Node.js), Firebase Auth, Firestore.
- **Data Visualization**: Recharts.
- **Security**: Firestore Row-Level Security (RLS) Rules.

## Key Features
- **Secure Authentication**: Google-based login with role-enforcement.
- **Command Dashboard**: Real-time stats and system health monitoring.
- **Inventory Control**: Master ledger with SKU search, category filtering, and low-stock alerts.
- **Atomic Transactions**: Secured stock adjustments with persistent audit logs.
- **Strategic Reporting**: Visual intelligence on asset distribution and stock flow.

## Deployment
This application is configured for deployment on **Cloud Run** via AI Studio.
The dev server runs on port 3000 and uses the `tsx` runtime for full-stack support.

### Local Development
1. `npm install`
2. `npm run dev`

### Production Build
1. `npm run build`
2. `npm start`

## Security Protocol
- All data is protected by strictly hardened Firestore rules.
- Transactions are immutable and atomic.
- Biometric-ready identity verification (Auth).

---
*UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED*
