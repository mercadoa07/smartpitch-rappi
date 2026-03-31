import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Header } from './Header';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  hideHeader?: boolean;
}

export function AppLayout({ children, title, showBack, hideHeader }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-[#FAFAFA] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {!hideHeader && <Header title={title} showBack={showBack} />}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-6">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
