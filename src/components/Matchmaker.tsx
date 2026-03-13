import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { X, Check, MapPin, Clock, Trophy, Zap, Info, Calendar as CalendarIcon } from 'lucide-react';
import { GAMES, getCourtById, CURRENT_USER, Game, joinGame } from '../data/mockData';
import { format } from 'date-fns';

interface MatchmakerProps {
  onClose: () => void;
}

export default function Matchmaker({ onClose }: MatchmakerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [joinedGames, setJoinedGames] = useState<string[]>([]);

  const potentialMatches = useMemo(() => {
    return GAMES
      .filter(g => g.status === 'open')
      .map(g => {
        let score = 0;
        const totalPoints = 100;
        
        // 1. Sport Preference (40 pts)
        if (CURRENT_USER.preferred_sports.includes(g.sport)) score += 40;
        
        // 2. Skill Match (30 pts)
        if (g.skill_level === CURRENT_USER.skill_level) score += 30;
        else if (
          (CURRENT_USER.skill_level === 'Intermediate' && (g.skill_level === 'Beginner' || g.skill_level === 'Advanced')) ||
          (CURRENT_USER.skill_level === 'Advanced' && g.skill_level === 'Intermediate')
        ) score += 15;

        // 3. Availability Check (30 pts)
        const gameDate = new Date(g.scheduled_start_time);
        const dayName = format(gameDate, 'EEE');
        const hour = gameDate.getHours();
        
        let timeOfDay: 'Morning' | 'Afternoon' | 'Evening' = 'Morning';
        if (hour >= 12 && hour < 17) timeOfDay = 'Afternoon';
        else if (hour >= 17) timeOfDay = 'Evening';

        const dayMatch = CURRENT_USER.availability.days.includes(dayName);
        const timeMatch = CURRENT_USER.availability.times.includes(timeOfDay);

        if (dayMatch && timeMatch) score += 30;
        else if (dayMatch || timeMatch) score += 15;

        return { ...g, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Top 10 matches
  }, []);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      const game = potentialMatches[currentIndex];
      joinGame(game.game_id, CURRENT_USER.user_id);
      setJoinedGames([...joinedGames, game.game_id]);
    }
    setCurrentIndex(prev => prev + 1);
  };

  if (currentIndex >= potentialMatches.length) {
    return (
      <div className="fixed inset-0 z-50 bg-bg-primary flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-accent-dim rounded-full flex items-center justify-center mb-8"
        >
          <Zap size={48} className="text-accent-primary" />
        </motion.div>
        <h2 className="text-3xl font-black tracking-tight mb-3">Runs Found!</h2>
        <p className="text-text-secondary mb-10 max-w-[280px]">
          We've matched you with the best games based on your schedule and skill.
        </p>
        <button
          onClick={onClose}
          className="w-full py-4 bg-accent-primary text-white font-black rounded-2xl shadow-xl accent-glow"
        >
          BACK TO EXPLORE
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-bg-primary/98 backdrop-blur-md flex flex-col pt-12">
      <div className="px-6 flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Run Matcher</h2>
          <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Personalized for you</p>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-bg-card border border-border-primary flex items-center justify-center text-text-tertiary">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 relative px-6 mb-8">
        <AnimatePresence>
          {potentialMatches.slice(currentIndex, currentIndex + 2).reverse().map((game, i) => {
            const isTop = (potentialMatches.length - currentIndex === 1) ? true : (i === 1);
            return (
              <MatchCard 
                key={game.game_id} 
                game={game} 
                onSwipe={handleSwipe} 
                isTop={isTop}
              />
            );
          })}
        </AnimatePresence>
      </div>

      <div className="px-6 pb-12 flex justify-center gap-8">
        <button 
          onClick={() => handleSwipe('left')}
          className="w-20 h-20 rounded-full bg-bg-card border-2 border-border-primary flex items-center justify-center text-red-500 shadow-2xl hover:scale-110 active:scale-90 transition-all"
        >
          <X size={36} strokeWidth={3} />
        </button>
        <button 
          onClick={() => handleSwipe('right')}
          className="w-20 h-20 rounded-full bg-bg-card border-2 border-border-primary flex items-center justify-center text-emerald-500 shadow-2xl hover:scale-110 active:scale-90 transition-all"
        >
          <Check size={36} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

function MatchCard({ game, onSwipe, isTop }: any) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  
  const nopeOpacity = useTransform(x, [-150, -50], [1, 0]);
  const joinOpacity = useTransform(x, [50, 150], [0, 1]);

  const court = getCourtById(game.court_id);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) onSwipe('right');
    else if (info.offset.x < -100) onSwipe('left');
  };

  return (
    <motion.div
      style={{ x, rotate, opacity, zIndex: isTop ? 10 : 0 }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ x: x.get() > 0 ? 800 : -800, opacity: 0, rotate: x.get() > 0 ? 45 : -45 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className="absolute inset-0 bg-bg-card border border-border-primary rounded-[40px] overflow-hidden shadow-2xl flex flex-col"
    >
      {/* Overlays */}
      {isTop && (
        <>
          <motion.div 
            style={{ opacity: joinOpacity }}
            className="absolute top-12 left-8 z-50 border-4 border-emerald-500 rounded-xl px-4 py-2 rotate-[-20deg]"
          >
            <span className="text-4xl font-black text-emerald-500 uppercase tracking-tighter">JOIN</span>
          </motion.div>
          <motion.div 
            style={{ opacity: nopeOpacity }}
            className="absolute top-12 right-8 z-50 border-4 border-red-500 rounded-xl px-4 py-2 rotate-[20deg]"
          >
            <span className="text-4xl font-black text-red-500 uppercase tracking-tighter">SKIP</span>
          </motion.div>
        </>
      )}

      <div className="h-[45%] relative">
        <img 
          src={`https://picsum.photos/seed/${game.game_id}/800/800`} 
          alt={game.sport}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent" />
        <div className="absolute top-6 left-6 flex gap-2">
          <div className="bg-accent-primary text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
            {game.sport}
          </div>
          <div className="bg-black/40 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
            {game.skill_level}
          </div>
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col">
        <div className="mb-8">
          <h3 className="text-3xl font-black tracking-tight mb-2 leading-tight">{court?.court_name}</h3>
          <div className="flex items-center gap-2 text-text-tertiary">
            <MapPin size={16} className="text-accent-primary" />
            <span className="text-sm font-bold">{court?.address}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-bg-elevated p-4 rounded-[24px] border border-border-primary">
            <div className="flex items-center gap-2 text-accent-primary mb-2">
              <Clock size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Time</span>
            </div>
            <p className="text-base font-black">{format(new Date(game.scheduled_start_time), 'h:mm a')}</p>
          </div>
          <div className="bg-bg-elevated p-4 rounded-[24px] border border-border-primary">
            <div className="flex items-center gap-2 text-accent-primary mb-2">
              <CalendarIcon size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Date</span>
            </div>
            <p className="text-base font-black">{format(new Date(game.scheduled_start_time), 'MMM d')}</p>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Info size={16} className="text-text-tertiary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Host Note</span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed font-medium italic">
            "{game.description}"
          </p>
        </div>

        <div className="mt-auto pt-8 flex items-center justify-between border-t border-border-primary">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-bg-card bg-bg-elevated flex items-center justify-center text-[10px] font-black">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">5+ Joined</span>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mb-1">Match Score</p>
            <div className="flex items-center gap-1.5 justify-end">
              <Zap size={14} className="text-accent-primary fill-accent-primary" />
              <p className="text-2xl font-black text-accent-primary">{(game as any).score}%</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
