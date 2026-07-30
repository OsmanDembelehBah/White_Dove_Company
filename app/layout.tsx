import './globals.css';
import type { Metadata } from 'next';
import { AppProvider } from '@/lib/store/app-store';
import Navbar from '@/components/Navbar';
import RealtimeToast from '@/components/RealtimeToast';

export const metadata: Metadata = {
  title: 'White Dove Electrical & Engineering - Live Inventory & POS',
  description:
    'Modern live inventory and point-of-sale management web application for White Dove Electrical & Engineering Company, Sierra Leone.',
  keywords: [
    'White Dove Electrical',
    'Sierra Leone Electrical POS',
    'Freetown Inventory System',
    'Solar Panels',
    'CCTV Systems',
    'Electrical Engineering',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0B192C] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-amber-500 selection:text-slate-950">
        <AppProvider>
          <Navbar />
          <RealtimeToast />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <footer className="bg-[#07101E] border-t border-whitedove-slate/50 py-6 text-xs text-slate-400 no-print">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white">White Dove Electrical & Engineering Co.</span>
                <span>• Freetown, Sierra Leone</span>
              </div>
              <p className="text-slate-500">
                © {new Date().getFullYear()} White Dove Ltd. Powering Today, Protecting Tomorrow.
              </p>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
