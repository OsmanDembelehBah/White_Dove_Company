# White Dove Electrical & Engineering Company
**Enterprise Portal, Manager Executive Dashboard & High-Speed Seller POS**  
*Location: Freetown, Sierra Leone*

---

## 🚀 Overview

White Dove is an enterprise-grade platform featuring real-time bi-directional data synchronization between executive management and point-of-sale registers, complete with PostgreSQL Supabase cloud integration and instant local storage backup.

---

## 🌟 Key Features

1. **Executive Portal (`index.html`)**
   - Professional portal landing page with tabbed role authentication (Manager & Seller).
   - Password reveal/hide toggle, "Remember Me", and 1-click Quick Demo logins.
   - Built-in Supabase Cloud Database status indicator and configuration dialog.
   - Seamless single-sign-on directly entering the respective dashboard.

2. **Manager Executive Dashboard (`manager.html`)**
   - **Live Sales Monitoring:** Real-time incoming sales notifications and live activity logs whenever a seller makes a transaction.
   - **Full Inventory Control:** Add, edit, update, or delete products with automatic live broadcast to Seller POS.
   - **Revenue & Trends Analytics:** Real-time revenue charts (Chart.js), category breakdown, and stock value calculations.
   - **Supabase Cloud Sync:** In-dashboard Supabase settings card to test connection, save credentials, and push/pull PostgreSQL data.

3. **Seller POS Terminal (`seller.html`)**
   - **Fast Point of Sale:** Instant product lookup with category pill filters (Cables, Lighting, Distribution, Boxes, Extension, Fans, Sockets, Switches, Earthing, Breakers, Solar, Accessories).
   - **Live Inventory Stock Sync:** Products added or updated by the manager appear immediately on the seller register.
   - **Automated Stock Deduction:** Completing a sale automatically deducts product inventory in real-time across both dashboards.
   - **Instant Receipts:** Generates downloadable professional PDF receipts and direct WhatsApp receipt sharing.

4. **Dual Real-time Sync Engine (`supabase-config.js`)**
   - **Cross-Window / Multi-Tab Instant Sync:** `BroadcastChannel` and `storage` event integration.
   - **PostgreSQL Database Cloud Sync:** Connected with Supabase Realtime Channels (`sales` and `inventory` tables).

---

## 🔑 Default Demo Credentials

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Manager** | Achmed Thoronka (CEO) | `achmed@whitedove.com` | `Whitedove2026` or `Manager@2024` |
| **Manager** | Mariama Sesay (Ops) | `mariama@whitedove.com` | `Whitedove2026` or `Manager@2024` |
| **Seller** | White Dove Solutions | `Solutionswhitedoveelectrical@gmail.com` | `Whitedove2026` |
| **Seller** | Mohamed Bangura | `mohamed@whitedove.com` | `seller123` |
| **Seller** | Sorie Kamara | `sorie@whitedove.com` | `seller123` |

---

## 💾 Supabase Setup

1. Open `supabase/schema.sql` and run the script in your Supabase SQL Editor.
2. Open `index.html` or the **Settings** section in `manager.html`.
3. Enter your **Supabase Project URL** and **Public Anon Key**.
4. Click **Test Connection** and **Save Supabase Config**.

---

## 🏁 Running the Application

Open `index.html` directly in any modern browser, or run a local static server:

```bash
npx serve .
```
