import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Home, Calendar, PlusCircle, Bell, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Screens
import HomeScreen from './screens/HomeScreen';
import GameDetailsScreen from './screens/GameDetailsScreen';
import ProfileScreen from './screens/ProfileScreen';
import CreateGameScreen from './screens/CreateGameScreen';
import UpcomingScreen from './screens/UpcomingScreen';
import NotificationsScreen from './screens/NotificationsScreen';

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Explore' },
    { path: '/upcoming', icon: Calendar, label: 'Upcoming' },
    { path: '/create', icon: PlusCircle, label: 'Run It', isCenter: true },
    { path: '/notifications', icon: Bell, label: 'Alerts' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-card border-t border-border-primary pb-safe pt-2 px-4 h-20 flex items-center justify-around z-50">
      {navItems.map(({ path, icon: Icon, label, isCenter }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) => 
            `flex flex-col items-center justify-center transition-colors ${
              isCenter 
                ? 'bg-accent-primary p-3 rounded-full -mt-10 accent-glow text-white' 
                : isActive ? 'text-accent-primary' : 'text-text-tertiary'
            }`
          }
        >
          <Icon size={isCenter ? 28 : 22} strokeWidth={isCenter ? 2.5 : 2} />
          {!isCenter && <span className="text-[10px] mt-1 font-medium uppercase tracking-wider">{label}</span>}
        </NavLink>
      ))}
    </nav>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen pb-24">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/game/:id" element={<GameDetailsScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/profile/:userId" element={<ProfileScreen />} />
            <Route path="/create" element={<CreateGameScreen />} />
            <Route path="/upcoming" element={<UpcomingScreen />} />
            <Route path="/notifications" element={<NotificationsScreen />} />
          </Routes>
        </AnimatePresence>
        <BottomNav />
      </div>
    </Router>
  );
}
