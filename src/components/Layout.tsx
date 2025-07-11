import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './layout/Header';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
      
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0">
          <Header 
            onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
            sidebarOpen={sidebarOpen}
          />

          <main className="flex-1 px-6 lg:px-8 pb-6">
            <Outlet />
          </main>
      </div>
    </div>
  );
}