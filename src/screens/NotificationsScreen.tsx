import React, { useState, useEffect } from 'react';
import { Bell, UserPlus, CheckCircle, MessageSquare, Info, ChevronRight, UserCheck, UserX } from 'lucide-react';
import { motion } from 'motion/react';
import { NOTIFICATIONS, getUserById } from '../data/mockData';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getFriendships, acceptFriendRequest, cancelFriendRequest, Friendship } from '../services/friendService';
import { useNavigate } from 'react-router-dom';

const ICON_MAP = {
  request: { icon: UserPlus, color: 'text-accent-primary', bg: 'bg-accent-dim' },
  approval: { icon: CheckCircle, color: 'text-status-green', bg: 'bg-status-green-muted' },
  chat: { icon: MessageSquare, color: 'text-status-blue', bg: 'bg-status-blue-muted' },
  info: { icon: Info, color: 'text-status-yellow', bg: 'bg-status-yellow-muted' },
};

export default function NotificationsScreen() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [friendships, setFriendships] = useState<Friendship[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (currentUser) {
      const unsub = getFriendships(currentUser.uid, (fs) => {
        setFriendships(fs);
      });
      return unsub;
    }
  }, [currentUser]);

  const friendRequests = friendships.filter(f => f.status === 'pending' && f.requester_id !== currentUser?.uid);

  const handleAccept = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await acceptFriendRequest(id);
  };

  const handleDecline = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await cancelFriendRequest(id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto px-4 pt-8 pb-24"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black tracking-tight">Alerts</h1>
        <button className="text-xs font-bold text-accent-primary">Mark all read</button>
      </div>

      <div className="space-y-3">
        {/* Friend Requests */}
        {friendRequests.map((request) => {
          const requester = getUserById(request.requester_id) || { full_name: 'Unknown Player' };
          return (
            <div 
              key={request.id}
              onClick={() => navigate(`/profile/${request.requester_id}`)}
              className="w-full flex flex-col gap-4 p-4 rounded-2xl border bg-bg-card border-accent-primary/30 relative cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-accent-dim text-accent-primary">
                  <UserPlus size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-text-primary">Friend Request</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    <span className="font-black text-text-primary">{requester.full_name}</span> wants to be friends.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={(e) => handleAccept(e, request.id)}
                  className="flex-1 py-2 rounded-xl bg-accent-primary text-white text-xs font-bold flex items-center justify-center gap-2"
                >
                  <UserCheck size={14} /> Accept
                </button>
                <button 
                  onClick={(e) => handleDecline(e, request.id)}
                  className="flex-1 py-2 rounded-xl bg-bg-elevated border border-border-primary text-text-tertiary text-xs font-bold flex items-center justify-center gap-2"
                >
                  <UserX size={14} /> Decline
                </button>
              </div>
            </div>
          );
        })}

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
