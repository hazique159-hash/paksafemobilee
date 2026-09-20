# PakSafeMobiles 🛡️

Pakistan's trusted mobile IMEI verification, stolen phone reporting, and verified retailer marketplace platform. Built with **Next.js 16 (App Router)**, **Tailwind CSS v4**, **Prisma ORM**, and **Neon PostgreSQL**.

---

## 🚀 Features

- **Public IMEI Verification**: Check if any 15-digit IMEI number is clean or reported stolen/lost with instant detailed alerts.
- **Role-Based Portals**:
  - **Normal Users**: Check IMEI, report stolen phones, view past reports, and locate verified retailers.
  - **Retailers**: Register shop, manage phone inventory, list devices for sale, check IMEI before purchasing devices, report stolen phones, and receive automated approval/status emails.
  - **Admin**: Dashboard analytics, manage user accounts, verify/approve retailers, lock/unlock retailer accounts with status toggles, and oversee stolen IMEI records.
- **OTP Email Verification**: Secure 6-digit OTP verification on registration using Nodemailer (Gmail SMTP).
- **Automated Notifications**: Real-time email alerts sent to retailers when approved, suspended, or reactivated by admin.
- **Mobile-First Responsive Design**: Optimized UI matching original mobile application design with interactive drawer navigation.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Database & ORM**: [Neon PostgreSQL](https://neon.tech/) + [Prisma 6](https://www.prisma.io/)
- **Authentication**: [NextAuth.js v5 Beta](https://authjs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Emails**: [Nodemailer](https://nodemailer.com/) (Gmail SMTP)
- **Language**: TypeScript

---

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/haziq159-hash/paksafe.git
cd paksafe
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and copy the contents from `.env.example`:
```env
DATABASE_URL="postgresql://username:password@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=require"
AUTH_SECRET="pakistan_safe_mobiles_secret_key_2024"
NEXTAUTH_URL="http://localhost:3000"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_app_password"
MAIL_FROM="your_email@gmail.com"
```

### 4. Push Database Schema & Seed Admin
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment on Vercel

1. Push this repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set the environment variables in the Vercel project settings:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_SECURE`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `MAIL_FROM`
4. Deploy!
