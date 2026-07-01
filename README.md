# Kabarak Student Welfare Management System (Frontend)

This is the frontend application for the Kabarak Student Welfare Management System. It is built using **React**, **Vite**, **TailwindCSS**, and **Ant Design** to deliver a premium, fast, and responsive user experience. 

## Features

- **Role-Based Access Control**: Separate interfaces for `Members` and `Admins`.
- **Member Dashboard**:
  - View active welfare campaigns.
  - Apply for campaigns and submit help inquiries.
  - Contribute securely via **M-Pesa Express (STK Push)**.
  - Track contribution history and account status in real-time.
- **Admin Dashboard**:
  - Manage users (grant/revoke access).
  - Create, approve, and end welfare campaigns.
  - Monitor live fund statistics.
  - Disburse funds to students.
  - Generate large-scale CSV contribution reports.
- **Centralized API SDK**: Uses Axios with interceptors for automatic JWT injection and uniform error handling (`src/services/api.js`).
- **Modern Aesthetics**: Built with a strict Green and Maroon color palette tailored to Kabarak University's branding. Flat SaaS layout, smooth micro-animations, and responsive design.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Ant Design
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Linting**: ESLint

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation

1. Clone the repository and navigate to the frontend directory:
   ```bash
   cd wms
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up your environment variables:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Running the Application

**Development Mode:**
```bash
pnpm run dev
```

**Production Build:**
```bash
pnpm run build
pnpm run preview
```

## Code Quality

The frontend adheres strictly to ESLint rules ensuring zero unused variables, optimized hooks, and robust error handling.
Run the linter to verify code health:
```bash
pnpm run lint
```
