import React from 'react';
import { Bell, UserPlus, CheckCircle, MessageSquare, Info, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { NOTIFICATIONS } from '../data/mockData';

const ICON_MAP = {
  request: { icon: UserPlus, color: 'text-accent-primary', bg: 'bg-accent-dim' },
  approval: { icon: CheckCircle, color: 'text-status-green', bg: 'bg-status-green-muted' },
  chat: { icon: MessageSquare, color: 'text-status-blue', bg: 'bg-status-blue-muted' },
  info: { icon: Info, color: 'text-status-yellow', bg: 'bg-status-yellow-muted' },
};

export default function NotificationsScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto px-4 pt-8"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black tracking-tight">Alerts</h1>
        <button className="text-xs font-bold text-accent-primary">Mark all read</button>
      </div>

      <div className="space-y-3">
        {NOTIFICATIONS.map((notif) => {
          const style = ICON_MAP[notif.type];
          return (
            <button 
              key={notif.id}
              className={`w-full flex items-start gap-4 p-4 rounded-2xl border transition-all text-left relative ${
                notif.unread ? 'bg-bg-card border-accent-primary/30' : 'bg-bg-card border-border-primary'
              }`}
            >
              {notif.unread && (
                <div className="absolute top-4 right-4 w-2 h-2 bg-accent-primary rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
              )}
              
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${style.bg} ${style.color}`}>
                <style.icon size={20} />
              </div>

              <div className="flex-1 pr-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-sm text-text-primary">{notif.title}</h3>
                  <span className="text-[10px] font-bold text-text-tertiary uppercase">{notif.time}</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{notif.message}</p>
              </div>
              
              <div className="self-center">
                <ChevronRight size={16} className="text-text-tertiary" />
              </div>
            </button>
          );
        })}
      </div>

      {NOTIFICATIONS.length === 0 && (
        <div className="text-center py-24">
          <div className="w-20 h-20 bg-bg-card border border-border-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Bell size={32} className="text-text-tertiary" />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">All caught up!</h3>
          <p className="text-text-secondary text-sm">No new notifications at the moment.</p>
        </div>
      )}
    </motion.div>
  );
}
