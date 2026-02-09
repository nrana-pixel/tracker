# Backend + DSA Tracker 🚀

A production-ready, full-stack web application for tracking DSA practice, backend skills, and viewing others' progress with social/motivational features.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Prisma](https://img.shields.io/badge/Prisma-5-2D3748) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC)

## ✨ Features

### Core Tracking
- 📊 **Dashboard** - Track streak, weekly stats, weak topics, and skill confidence
- 📚 **Topic Management** - Create custom topics for DSA, Backend, or Custom categories
- 📝 **Daily Logs** - Log problems solved, revisions, energy levels, and star ratings
- 💪 **Backend Skills** - Track confidence levels, practiced status, and project usage

### Analytics & Insights
- 📈 **Beautiful Charts** - Line charts for DSA progress and revision volume
- 📊 **Skill Confidence** - Bar charts showing backend skill proficiency
- 🎯 **Weak Topic Detection** - Automatically identifies areas needing focus
- 🔥 **Streak Tracking** - Motivational consecutive day tracking

### Social Features
- 🌍 **Activity Feed** - See other users' public progress for motivation
- 👤 **Public Profiles** - View other developers' stats and recent activity
- 🔒 **Privacy Controls** - Toggle individual logs and profile visibility

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **Database**: PostgreSQL
- **ORM**: Prisma 5
- **Authentication**: NextAuth.js (Credentials provider)
- **Password Hashing**: bcryptjs
- **Charts**: Recharts
- **Validation**: Zod v4

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **PostgreSQL** database (local or cloud)
- **npm** or **yarn**

### Installation

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   
   Update `.env` with your database credentials:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dsa_tracker"
   NEXTAUTH_SECRET="your-super-secret-key-change-this"
   NEXTAUTH_URL="http://localhost:3000"
   ```

   > **Tip**: Generate a secure secret with: `openssl rand -base64 32`

3. **Initialize database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev --name init
   ```

4. **Seed sample data (optional)**
   ```bash
   npx prisma db seed
   ```
   
   This creates two demo users:
   - **Email**: demo@example.com | **Password**: demo123
   - **Email**: ninja@example.com | **Password**: test123

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Public auth pages
│   │   ├── login/           # Login page
│   │   └── register/        # Registration page
│   ├── (protected)/         # Protected routes (require auth)
│   │   ├── dashboard/       # Main dashboard
│   │   ├── topics/          # Topic management
│   │   ├── logs/            # Daily log creation
│   │   ├── skills/          # Backend skills tracking
│   │   ├── analytics/       # Charts and analytics
│   │   └── profile/         # User profile settings
│   ├── feed/                # Public activity feed
│   ├── users/[id]/          # Public user profiles
│   ├── api/auth/            # NextAuth API routes
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── StarRating.tsx
│   │   ├── Slider.tsx
│   │   ├── Select.tsx
│   │   └── Toggle.tsx
│   ├── charts/              # Recharts components
│   │   ├── WeeklyDSAChart.tsx
│   │   ├── RevisionVolumeChart.tsx
│   │   └── SkillConfidenceChart.tsx
│   ├── layout/              # Layout components
│   │   └── Navbar.tsx
│   └── Providers.tsx        # NextAuth provider wrapper
├── actions/                 # Server Actions
│   ├── auth.ts             # Registration
│   ├── topics.ts           # Topic CRUD
│   ├── logs.ts             # Daily log CRUD
│   ├── skills.ts           # Skill CRUD
│   ├── dashboard.ts        # Dashboard data
│   ├── feed.ts             # Public feed & profiles
│   └── profile.ts          # Profile management
├── lib/                     # Utilities
│   ├── prisma.ts           # Prisma client singleton
│   ├── auth.ts             # NextAuth configuration
│   └── utils.ts            # Helper functions
└── types/                   # TypeScript types
    └── next-auth.d.ts      # NextAuth type extensions

prisma/
├── schema.prisma           # Database schema
└── seed.ts                 # Seed data script
```

## 🎯 Key Features Explained

### Topic Status Calculation
Topics are automatically color-coded based on your progress:
- 🔴 **Weak** - Less than 3 easy problems solved
- 🟡 **Improving** - 3+ easy problems solved
- 🟢 **Strong** - 5+ easy AND 5+ medium problems solved

### Privacy Controls
- **Per-log privacy**: Toggle visibility for individual daily logs
- **Profile privacy**: Make your entire profile private to hide from the public feed

### Streak Calculation
Your streak is calculated as consecutive days with at least one log entry. Miss a day and it resets!

### Social Motivation
The activity feed shows real-time updates from other users who have made their profiles public, helping you stay motivated by seeing others' progress.

## 🔧 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Prisma Studio (database GUI)
npx prisma studio
```

## 📊 Database Schema

The app uses 4 main models:

- **User** - Authentication and profile data
- **Topic** - Custom topics (DSA, Backend, Custom)
- **DailyLog** - Daily progress entries
- **BackendSkill** - Backend technology confidence tracking

See `prisma/schema.prisma` for the complete schema.

## 🎨 Design Philosophy

- **Dark Mode First** - Beautiful dark theme with glassmorphism effects
- **Gradient Accents** - Indigo to purple gradients for visual appeal
- **Micro-animations** - Smooth transitions and hover effects
- **Mobile Responsive** - Fully responsive design for all screen sizes

## 🔐 Security

- Passwords hashed with bcryptjs (12 rounds)
- JWT-based sessions with NextAuth.js
- Server-side validation with Zod
- Protected API routes and server actions
- SQL injection protection via Prisma

## 📝 License

MIT

## 🙏 Acknowledgments

Built with ❤️ using:
- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)

---

**Happy Coding! 🚀**
