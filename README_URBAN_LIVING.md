# Urban Living - B2B2C Property Management Platform

A modern property management platform built with Next.js 15, TypeScript, Tailwind CSS, and Firebase.

## 🏗️ Project Structure

```
urban-living-web/
├── app/
│   ├── (public)/              # Public zone (QR code landing pages)
│   │   ├── layout.tsx         # Public layout
│   │   └── p/
│   │       └── [slug]/
│   │           └── page.tsx   # Dynamic building page
│   │
│   ├── (dashboard)/           # Admin zone (property owners)
│   │   ├── layout.tsx         # Dashboard layout with sidebar
│   │   └── dashboard/
│   │       ├── page.tsx              # Dashboard home
│   │       ├── my-buildings/         # View all buildings
│   │       │   └── page.tsx
│   │       ├── add-property/         # Add new building
│   │       │   └── page.tsx
│   │       └── account/              # Account settings
│   │           └── page.tsx
│   │
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── globals.css            # Global styles
│
├── components/
│   ├── public/                # Public zone components
│   │   ├── BuildingHeader.tsx # Building details display
│   │   └── UnitCard.tsx       # Unit listing card
│   │
│   └── dashboard/             # Dashboard components
│       ├── AuthGuard.tsx      # Firebase Auth protection
│       └── Sidebar.tsx        # Dashboard navigation
│
├── lib/
│   └── firebase.ts            # Firebase configuration
│
├── types/
│   └── firestore.ts           # TypeScript interfaces
│
└── public/                    # Static assets

```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase project created ([Firebase Console](https://console.firebase.google.com/))
- npm or yarn package manager

### Installation

1. **Clone and install dependencies** (already done):
   ```bash
   cd urban-living-web
   npm install
   ```

2. **Configure Firebase**:

   Create a `.env.local` file in the project root:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

   **Get your Firebase credentials:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Go to Project Settings (⚙️ icon) → General
   - Scroll down to "Your apps" and select your web app
   - Copy the config values to your `.env.local`

3. **Set up Firestore Database**:

   - Go to Firebase Console → Firestore Database
   - Click "Create database"
   - Start in **production mode** or **test mode**
   - Create the following collections:
     - `users`
     - `buildings`
     - `units`

4. **Set up Firebase Authentication**:

   - Go to Firebase Console → Authentication
   - Click "Get started"
   - Enable your preferred sign-in methods (Email/Password recommended)

5. **Run the development server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Features

### Public Zone (`/p/[slug]`)
- **QR Code Landing Pages**: Each building has a unique URL accessible via QR code
- **Mobile-First Design**: Optimized for mobile devices
- **Building Information**: Display building details, address, amenities
- **Unit Listings**: Show available units with rent, type, and status
- **Responsive Grid**: Cards adapt to screen sizes

### Admin Dashboard (`/dashboard`)
- **Firebase Authentication**: Secure access with email/password
- **Sidebar Navigation**: Easy access to all admin features
- **My Buildings**: View and manage all properties
- **Add Property**: Create new building listings with auto-slug generation
- **Account Settings**: View profile and manage account
- **Mobile Responsive**: Collapsible sidebar for mobile devices

## 🗄️ Database Schema

### Collections

#### `users`
```typescript
{
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'tenant';
  createdAt: Date;
  updatedAt: Date;
}
```

#### `buildings`
```typescript
{
  id: string;
  slug: string;              // Unique URL identifier
  name: string;
  address: string;
  ownerId: string;           // Reference to users collection
  description?: string;
  imageUrl?: string;
  amenities?: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### `units`
```typescript
{
  id: string;
  buildingId: string;        // Reference to buildings collection
  type: string;              // e.g., "2BHK", "Studio"
  rent: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  description?: string;
  floor?: number;
  unitNumber?: string;
  area?: number;             // in sq ft
  amenities?: string[];
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

## 🛣️ Routing Strategy

This project uses **Next.js 15 App Router** with **Route Groups**:

- `(public)` - Public-facing pages (no auth required)
  - URL: `/p/[slug]` → QR code landing pages
  
- `(dashboard)` - Admin pages (auth required)
  - URL: `/dashboard` → Protected admin area

Route groups (`(folder)`) organize code without affecting URL structure.

## 🎨 Styling

- **Tailwind CSS v4** for utility-first styling
- **Mobile-First Approach** with responsive breakpoints
- **Custom Components** with consistent design system
- **Dark Sidebar** for admin dashboard
- **Card-Based Layouts** for content display

## 🔐 Authentication

Firebase Authentication is implemented with:
- **AuthGuard Component**: Protects all dashboard routes
- **useAuthState Hook**: Real-time auth state management
- **Automatic Redirects**: Unauthenticated users are blocked
- **Sign Out Functionality**: Available in sidebar and account page

## 📱 QR Code Integration

To generate QR codes for your buildings:

1. Get the building's public URL: `/p/[slug]`
2. Use any QR code generator (e.g., [QR Code Generator](https://www.qr-code-generator.com/))
3. Convert the full URL (e.g., `https://yourdomain.com/p/tower-heights-mumbai`)
4. Print and place the QR code at your property

## 🚧 Next Steps

1. **Add Firebase Credentials**: Update `.env.local` with your Firebase config
2. **Create User Account**: Set up authentication in Firebase Console
3. **Add Test Data**: Create sample buildings and units in Firestore
4. **Customize Styling**: Adjust colors and design to match your brand
5. **Add Features**:
   - Unit booking system
   - Tenant management
   - Payment integration
   - Image upload to Firebase Storage
   - Email notifications
   - Analytics dashboard

## 📝 Development Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🔧 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Firebase
  - Firestore (Database)
  - Authentication
  - Storage
- **React Hooks**: react-firebase-hooks
- **Deployment**: Ready for Vercel/Firebase Hosting

## 📄 License

This project is private and proprietary.

---

**Built with ❤️ for Urban Living**
