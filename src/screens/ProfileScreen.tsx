import React, { useState } from 'react';
import { Settings, Shield, Trophy, History, MapPin, Edit3, LogOut, ChevronRight, User, Bell, Wallet, CreditCard, RefreshCw } from 'lucide-react';
import { CURRENT_USER } from '../data/mockData';
import { motion } from 'motion/react';
import SkillSurvey from '../components/SkillSurvey';

export default function ProfileScreen() {
  const [showSurvey, setShowSurvey] = useState(false);
  const [userSkillLevel, setUserSkillLevel] = useState(CURRENT_USER.skill_level);

  const stats = [
    { label: 'Attended', value: CURRENT_USER.games_attended_count, icon: History },
    { label: 'Hosted', value: CURRENT_USER.games_hosted_count, icon: Trophy },
    { label: 'Reliability', value: `${CURRENT_USER.reliability_score}%`, icon: Shield },
  ];

  const handleSurveyComplete = (level: 'Beginner' | 'Intermediate' | 'Advanced') => {
    setUserSkillLevel(level);
    setShowSurvey(false);
    CURRENT_USER.skill_level = level;
    CURRENT_USER.has_completed_survey = true;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto px-4 pt-8 pb-20"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black tracking-tight">Profile</h1>
        <button className="p-2 rounded-xl bg-bg-card border border-border-primary text-text-secondary">
          <Settings size={20} />
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-bg-card border border-border-primary rounded-3xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-accent-dim border-2 border-accent-primary flex items-center justify-center text-3xl font-black text-accent-primary overflow-hidden shadow-xl">
              {CURRENT_USER.profile_photo_url ? (
                <img src={CURRENT_USER.profile_photo_url} alt={CURRENT_USER.full_name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                CURRENT_USER.full_name.charAt(0)
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-accent-primary rounded-full border-2 border-bg-card flex items-center justify-center text-white shadow-lg">
              <Edit3 size={12} />
            </button>
          </div>
          
          <div>
            <h2 className="text-xl font-black text-text-primary">{CURRENT_USER.full_name}</h2>
            <div className="flex items-center gap-1 text-text-tertiary text-sm mb-1">
              <MapPin size={14} />
              <span>Berkeley, CA</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-status-yellow-muted text-status-yellow text-[10px] font-black uppercase tracking-widest">
                {userSkillLevel}
              </span>
              <button 
                onClick={() => setShowSurvey(true)}
                className="p-1 rounded-full bg-bg-elevated border border-border-primary text-text-tertiary hover:text-accent-primary transition-colors"
                title="Retake Skill Survey"
              >
                <RefreshCw size={10} />
              </button>
            </div>
          </div>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed mb-6">
          {CURRENT_USER.bio}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-bg-elevated rounded-2xl p-3 text-center border border-border-primary/50">
              <stat.icon size={16} className="mx-auto mb-1 text-accent-primary" />
              <p className="text-lg font-black text-text-primary leading-none">{stat.value}</p>
              <p className="text-[9px] uppercase font-bold text-text-tertiary mt-1 tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <SkillSurvey 
        isOpen={showSurvey} 
        onClose={() => setShowSurvey(false)} 
        onComplete={handleSurveyComplete} 
      />

      {/* Menu Sections */}
      <div className="space-y-4">
        <section>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mb-3 px-2">Wallet & Payments</h3>
          <div className="bg-bg-card border border-border-primary rounded-2xl overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 border-b border-border-primary hover:bg-white/5 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent-muted flex items-center justify-center text-accent-primary">
                  <Wallet size={18} />
                </div>
                <div>
                  <span className="text-sm font-bold block">RunIt Credits</span>
                  <span className="text-[10px] text-text-tertiary font-bold">$24.50 available</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-text-tertiary" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-bg-elevated flex items-center justify-center text-text-primary">
                  <CreditCard size={18} />
                </div>
                <span className="text-sm font-bold">Payment Methods</span>
              </div>
              <ChevronRight size={16} className="text-text-tertiary" />
            </button>
          </div>
        </section>

        <section>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mb-3 px-2">Account</h3>
          <div className="bg-bg-card border border-border-primary rounded-2xl overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 border-b border-border-primary hover:bg-white/5 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-muted flex items-center justify-center text-status-blue">
                  <User size={18} />
                </div>
                <span className="text-sm font-bold">Personal Information</span>
              </div>
              <ChevronRight size={16} className="text-text-tertiary" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-status-green-muted flex items-center justify-center text-status-green">
                  <Shield size={18} />
                </div>
                <span className="text-sm font-bold">Privacy & Security</span>
              </div>
              <ChevronRight size={16} className="text-text-tertiary" />
            </button>
          </div>
        </section>

        <section>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mb-3 px-2">Preferences</h3>
          <div className="bg-bg-card border border-border-primary rounded-2xl overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 border-b border-border-primary hover:bg-white/5 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-status-yellow-muted flex items-center justify-center text-status-yellow">
                  <Bell size={18} />
                </div>
                <span className="text-sm font-bold">Notifications</span>
              </div>
              <ChevronRight size={16} className="text-text-tertiary" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent-muted flex items-center justify-center text-accent-primary">
                  <MapPin size={18} />
                </div>
                <span className="text-sm font-bold">Radius & Location</span>
              </div>
              <ChevronRight size={16} className="text-text-tertiary" />
            </button>
          </div>
        </section>

        <button className="w-full flex items-center justify-center gap-2 p-4 text-status-red font-bold text-sm bg-status-red-muted rounded-2xl border border-status-red/20 mt-8">
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </motion.div>
  );
}
