# White Dove

White Dove is a modern Next.js web application featuring real-time data management, role-based user management (Manager & Seller dashboards), and Supabase backend integration.

## 🚀 Features

- **Role-Based Dashboards:** Dedicated routes for Manager and Seller workflows.
- **Inventory & Product Management:** Modals for adding, editing, and managing product catalogs.
- **Sales Logging & Receipts:** Real-time sale logging with downloadable/viewable receipts.
- **Supabase Integration:** Built-in PostgreSQL schema and store integrations.
- **Real-time Notifications:** Toast feedback for user actions.

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS, PostCSS
- **Backend / Database:** Supabase (SQL)
- **State Management:** Zustand / Custom store structure

## 🏁 Getting Started

### 1. Prerequisites

Ensure you have **Node.js** (v18+) and **npm** installed.

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone [https://github.com/YOUR_USERNAME/white-dove.git](https://github.com/YOUR_USERNAME/white-dove.git)
cd white-dove
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.
