import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Settings, Shield, Trophy, History, MapPin, Edit3, LogOut, ChevronRight, User, Bell, Wallet, CreditCard, RefreshCw, UserPlus, UserCheck, UserX, Users } from 'lucide-react';
import { CURRENT_USER, USERS, getUserById } from '../data/mockData';
import { motion } from 'motion/react';
import SkillSurvey from '../components/SkillSurvey';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { sendFriendRequest, acceptFriendRequest, cancelFriendRequest, unfriend, getFriendships, getMutualFriends, Friendship } from '../services/friendService';

export default function ProfileScreen() {
  const { userId: profileId } = useParams();
  const navigate = useNavigate();
  const [showSurvey, setShowSurvey] = useState(false);
  const [userSkillLevel, setUserSkillLevel] = useState(CURRENT_USER.skill_level);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [profileFriendCount, setProfileFriendCount] = useState(0);
  const [mutualFriends, setMutualFriends] = useState<string[]>([]);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Determine if we are viewing our own profile
  const isOwnProfile = !profileId || profileId === currentUser?.uid || profileId === CURRENT_USER.user_id;
  
  // Get the profile user data
  const profileUser = isOwnProfile ? CURRENT_USER : (getUserById(profileId!) || {
    user_id: profileId,
    full_name: 'Unknown Player',
    profile_photo_url: null,
    skill_level: 'Intermediate',
    bio: 'No bio available.',
    games_attended_count: 0,
    games_hosted_count: 0,
    reliability_score: 0,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthReady(true);
      if (user) {
        // Sync user to Firestore
        const userRef = doc(db, 'users', user.uid);
        setDoc(userRef, {
          user_id: user.uid,
          full_name: user.displayName || CURRENT_USER.full_name,
          profile_photo_url: user.photoURL,
          skill_level: CURRENT_USER.skill_level,
          bio: CURRENT_USER.bio
        }, { merge: true });
      }
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

  useEffect(() => {
    const targetId = profileId || currentUser?.uid || CURRENT_USER.user_id;
    if (targetId) {
      const unsub = getFriendships(targetId, (fs) => {
        setProfileFriendCount(fs.filter(f => f.status === 'accepted').length);
      });
      return unsub;
    }
  }, [currentUser, profileId]);

  useEffect(() => {
    if (currentUser && profileId && !isOwnProfile) {
      getMutualFriends(currentUser.uid, profileId).then(setMutualFriends);
    }
  }, [currentUser, profileId, isOwnProfile]);

  const friendship = profileId ? friendships.find(f => f.users.includes(profileId)) : null;

  const handleFriendAction = async () => {
    if (!currentUser) {
      await signInAnonymously(auth);
      return;
    }

    if (!profileId) return;

    if (!friendship) {
      await sendFriendRequest(currentUser.uid, profileId);
    } else if (friendship.status === 'pending') {
      if (friendship.requester_id === currentUser.uid) {
        await cancelFriendRequest(friendship.id);
      } else {
        await acceptFriendRequest(friendship.id);
      }
    } else {
      await unfriend(friendship.id);
    }
  };

  const stats = [
    { label: 'Attended', value: profileUser.games_attended_count, icon: History },
    { label: 'Hosted', value: profileUser.games_hosted_count, icon: Trophy },
    { label: 'Reliability', value: `${profileUser.reliability_score}%`, icon: Shield },
  ];

  const friendCount = friendships.filter(f => f.status === 'accepted').length;

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
        <div className="flex items-center gap-3">
          {!isOwnProfile && (
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-bg-card border border-border-primary text-text-secondary"
            >
              <ChevronRight className="rotate-180" size={20} />
            </button>
          )}
          <h1 className="text-2xl font-black tracking-tight">
            {isOwnProfile ? 'Profile' : 'Player Profile'}
          </h1>
        </div>
        {isOwnProfile && (
          <button className="p-2 rounded-xl bg-bg-card border border-border-primary text-text-secondary">
            <Settings size={20} />
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-bg-card border border-border-primary rounded-3xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-accent-dim border-2 border-accent-primary flex items-center justify-center text-3xl font-black text-accent-primary overflow-hidden shadow-xl">
              {profileUser.profile_photo_url ? (
                <img src={profileUser.profile_photo_url} alt={profileUser.full_name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                profileUser.full_name.charAt(0)
              )}
            </div>
            {isOwnProfile && (
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-accent-primary rounded-full border-2 border-bg-card flex items-center justify-center text-white shadow-lg">
                <Edit3 size={12} />
              </button>
            )}
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-black text-text-primary">{profileUser.full_name}</h2>
            <div className="flex items-center gap-1 text-text-tertiary text-sm mb-1">
              <MapPin size={14} />
              <span>Berkeley, CA</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-status-yellow-muted text-status-yellow text-[10px] font-black uppercase tracking-widest">
                {isOwnProfile ? userSkillLevel : profileUser.skill_level}
              </span>
              {isOwnProfile && (
                <button 
                  onClick={() => setShowSurvey(true)}
                  className="p-1 rounded-full bg-bg-elevated border border-border-primary text-text-tertiary hover:text-accent-primary transition-colors"
                  title="Retake Skill Survey"
                >
                  <RefreshCw size={10} />
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed mb-6">
          {profileUser.bio}
        </p>

        {/* Friend Actions & Stats */}
        <div className="flex flex-col gap-4 mb-6 pt-4 border-t border-border-primary/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-lg font-black text-text-primary leading-none">
                  {profileFriendCount}
                </p>
                <p className="text-[9px] uppercase font-bold text-text-tertiary mt-1 tracking-wider">Friends</p>
              </div>
              {!isOwnProfile && mutualFriends.length > 0 && (
                <div className="text-center border-l border-border-primary/50 pl-4">
                  <p className="text-lg font-black text-accent-primary leading-none">{mutualFriends.length}</p>
                  <p className="text-[9px] uppercase font-bold text-text-tertiary mt-1 tracking-wider">Mutual</p>
                </div>
              )}
            </div>

            {!isOwnProfile && (
              <button 
                onClick={handleFriendAction}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  !friendship 
                    ? 'bg-accent-primary text-white shadow-lg accent-glow' 
                    : friendship.status === 'pending'
                      ? friendship.requester_id === currentUser?.uid
                        ? 'bg-bg-elevated text-text-tertiary border border-border-primary'
                        : 'bg-status-green text-white shadow-lg'
                      : 'bg-status-red-muted text-status-red border border-status-red/20'
                }`}
              >
                {!friendship ? (
                  <><UserPlus size={16} /> Add Friend</>
                ) : friendship.status === 'pending' ? (
                  friendship.requester_id === currentUser?.uid ? (
                    <><UserX size={16} /> Cancel Request</>
                  ) : (
                    <><UserCheck size={16} /> Accept Request</>
                  )
                ) : (
                  <><UserX size={16} /> Unfriend</>
                )}
              </button>
            )}
          </div>

          {!isOwnProfile && mutualFriends.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {mutualFriends.slice(0, 3).map((uid, i) => (
                  <div key={uid} className="w-6 h-6 rounded-full border-2 border-bg-card bg-bg-elevated flex items-center justify-center text-[8px] font-bold text-text-tertiary">
                    {getUserById(uid)?.full_name.charAt(0) || '?'}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-text-tertiary font-medium">
                {mutualFriends.length === 1 
                  ? `Mutual friend: ${getUserById(mutualFriends[0])?.full_name}`
                  : `${mutualFriends.length} mutual friends`}
              </p>
            </div>
          )}
        </div>

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
