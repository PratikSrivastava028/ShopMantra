import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { NotificationDrawer } from '../components/layout/NotificationDrawer';
import { AiBuddyDrawer } from '../components/layout/AiBuddyDrawer';
import { useChatStore } from '../store/chatStore';
import { Sparkles } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { toggleOpen: toggleAiChat, isOpen: isAiChatOpen } = useChatStore();

  return (
    <div className="flex flex-col min-h-screen bg-brand-lightBg dark:bg-brand-darkBg text-brand-text dark:text-slate-100 transition-colors duration-200">

      {/* Responsive Navbar */}
      <Navbar onToggleNotifications={() => setIsNotificationsOpen(true)} />

      {/* Notifications overlay panel */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Floating AI Shopping Buddy Chat Drawer */}
      <AiBuddyDrawer />

      {/* Main Page Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Reusable Footer */}
      <Footer />

      {/* Floating Sparkle AI Assistant Trigger Button (Bottom-Right) */}
      {!isAiChatOpen && (
        <button
          onClick={toggleAiChat}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white p-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all animate-bounce"
          title="Open AI Shopping Assistant"
          aria-label="AI Shopping Assistant"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      )}

    </div>
  );
};
