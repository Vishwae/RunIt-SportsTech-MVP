import React, { useState, useMemo, useEffect } from 'react';
import { Search, Map as MapIcon, List, X, Filter, Trophy, Activity, Target, Zap, Calendar as CalendarIcon } from 'lucide-react';
import { GAMES, COURTS, getCourtById, CURRENT_USER, Sport } from '../data/mockData';
import GameCard from '../components/GameCard';
import { motion, AnimatePresence } from 'motion/react';
import SkillSurvey from '../components/SkillSurvey';
import { format, addDays, isSameDay, startOfDay } from 'date-fns';
import Matchmaker from '../components/Matchmaker';

const SKILL_FILTERS = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const SPORT_FILTERS: (Sport | 'All')[] = ['All', 'Basketball', 'Soccer', 'Pickleball', 'Tennis', 'Volleyball'];

export default function HomeScreen() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [activeSkill, setActiveSkill] = useState('All');
  const [activeSport, setActiveSport] = useState<Sport | 'All'>('All');
  const [searchText, setSearchText] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showSurvey, setShowSurvey] = useState(false);
  const [showMatchmaker, setShowMatchmaker] = useState(false);
  const [userSkillLevel, setUserSkillLevel] = useState(CURRENT_USER.skill_level);
  const [hasCompletedSurvey, setHasCompletedSurvey] = useState(CURRENT_USER.has_completed_survey);
  const [filterByMySkill, setFilterByMySkill] = useState(true);

  // Generate next 7 days
  const dates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
  }, []);

  const handleSurveyComplete = (level: 'Beginner' | 'Intermediate' | 'Advanced') => {
    setUserSkillLevel(level);
    setHasCompletedSurvey(true);
    setShowSurvey(false);
    CURRENT_USER.skill_level = level;
    CURRENT_USER.has_completed_survey = true;
    setShowMatchmaker(true);
  };

  const filteredGames = useMemo(() => {
    return GAMES
      .filter((g) => g.status === 'open')
      .filter((g) => {
        if (filterByMySkill) {
          return g.skill_level === userSkillLevel;
        }
        return activeSkill === 'All' || g.skill_level === activeSkill;
      })
      .filter((g) => activeSport === 'All' || g.sport === activeSport)
      .filter((g) => !selectedDate || isSameDay(new Date(g.scheduled_start_time), selectedDate))
      .filter((g) => {
        if (!searchText) return true;
        const court = getCourtById(g.court_id);
        const q = searchText.toLowerCase();
        return (
          court?.court_name.toLowerCase().includes(q) ||
          g.description?.toLowerCase().includes(q) ||
          g.sport.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        return new Date(a.scheduled_start_time).getTime() - new Date(b.scheduled_start_time).getTime();
      });
  }, [activeSkill, activeSport, searchText, userSkillLevel, selectedDate, filterByMySkill]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto px-4 pt-6"
    >
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-baseline">
          <h1 className="text-3xl font-black tracking-tighter text-text-primary">Run</h1>
          <span className="text-3xl font-black tracking-tighter text-accent-primary ml-0.5">It!</span>
        </div>
        
        <div className="flex bg-bg-card rounded-xl p-1 border border-border-primary">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-accent-primary text-white shadow-lg' : 'text-text-tertiary'}`}
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'map' ? 'bg-accent-primary text-white shadow-lg' : 'text-text-tertiary'}`}
          >
            <MapIcon size={18} />
          </button>
        </div>
      </header>

      {/* Find Me a Game Button */}
      <div className="mb-6">
        <button
          onClick={() => {
            if (!hasCompletedSurvey) {
              setShowSurvey(true);
            } else {
              setShowMatchmaker(true);
            }
          }}
          className="w-full bg-accent-primary p-4 rounded-2xl flex items-center justify-between group relative overflow-hidden accent-glow"
        >
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
              <Zap size={24} fill="currentColor" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-black text-lg leading-none mb-1">Find Me a Game</h3>
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Instant Matchmaking</p>
            </div>
          </div>
          <div className="relative z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:translate-x-1 transition-transform">
            <Zap size={20} />
          </div>
          
          {/* Animated background element */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -right-4 -top-4 w-32 h-32 bg-white rounded-full blur-3xl"
          />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search size={18} className="text-text-tertiary" />
        </div>
        <input
          type="text"
          placeholder="Search courts or games..."
          className="w-full bg-bg-card border border-border-primary rounded-2xl py-3.5 pl-11 pr-10 text-text-primary focus:outline-none focus:border-accent-primary/50 transition-colors"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        {searchText && (
          <button 
            onClick={() => setSearchText('')}
            className="absolute inset-y-0 right-4 flex items-center"
          >
            <X size={18} className="text-text-tertiary hover:text-text-secondary" />
          </button>
        )}
      </div>

      {/* Date Selector */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 px-1">
          <CalendarIcon size={14} className="text-accent-primary" />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Select Date</h3>
        </div>
        <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-3 no-scrollbar">
          <button
            onClick={() => setSelectedDate(null)}
            className={`flex-shrink-0 w-14 h-16 rounded-2xl flex flex-col items-center justify-center border transition-all ${
              selectedDate === null 
                ? 'bg-accent-primary border-accent-primary text-white shadow-lg' 
                : 'bg-bg-card border-border-primary text-text-tertiary hover:border-text-tertiary'
            }`}
          >
            <span className="text-[10px] font-black uppercase tracking-tighter mb-1">All</span>
            <span className="text-lg font-black leading-none">Any</span>
          </button>
          {dates.map((date, i) => {
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isToday = i === 0;
            const isTomorrow = i === 1;
            
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`flex-shrink-0 w-14 h-16 rounded-2xl flex flex-col items-center justify-center border transition-all ${
                  isSelected 
                    ? 'bg-accent-primary border-accent-primary text-white shadow-lg' 
                    : 'bg-bg-card border-border-primary text-text-tertiary hover:border-text-tertiary'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-tighter mb-1">
                  {isToday ? 'Today' : isTomorrow ? 'Tmw' : format(date, 'EEE')}
                </span>
                <span className="text-lg font-black leading-none">
                  {format(date, 'd')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Skill Preference Toggle */}
      <div className="mb-6 bg-bg-card border border-border-primary rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${filterByMySkill ? 'bg-accent-primary text-white' : 'bg-bg-elevated text-text-tertiary'}`}>
              <Target size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">My Skill Level</h3>
              <p className="text-[10px] text-text-tertiary uppercase font-black tracking-widest">Showing {userSkillLevel} runs</p>
            </div>
          </div>
          <button 
            onClick={() => setFilterByMySkill(!filterByMySkill)}
            className={`w-12 h-6 rounded-full transition-colors relative ${filterByMySkill ? 'bg-accent-primary' : 'bg-bg-elevated'}`}
          >
            <motion.div 
              animate={{ x: filterByMySkill ? 24 : 4 }}
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
            />
          </button>
        </div>
      </div>

      {/* Sport Filters */}
      <div className="flex overflow-x-auto pb-4 mb-2 scrollbar-hide gap-2 no-scrollbar">
        {SPORT_FILTERS.map((sport) => (
          <button
            key={sport}
            onClick={() => setActiveSport(sport)}
            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${
              activeSport === sport 
                ? 'bg-accent-primary border-accent-primary text-white shadow-md' 
                : 'bg-bg-card border-border-primary text-text-tertiary hover:border-text-tertiary'
            }`}
          >
            {sport}
          </button>
        ))}
      </div>

      {/* Skill Filters */}
      {!filterByMySkill && (
        <div className="flex overflow-x-auto pb-4 mb-2 scrollbar-hide gap-2 no-scrollbar">
          {SKILL_FILTERS.map((skill) => (
            <button
              key={skill}
              onClick={() => setActiveSkill(skill)}
              className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                activeSkill === skill 
                  ? 'bg-accent-primary border-accent-primary text-white shadow-md' 
                  : 'bg-bg-card border-border-primary text-text-tertiary hover:border-text-tertiary'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-text-secondary uppercase tracking-widest">
          {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''} nearby
        </h2>
        <button className="text-accent-primary p-1">
          <Filter size={18} />
        </button>
      </div>

      {/* Game List */}
      <AnimatePresence mode="popLayout">
        {viewMode === 'list' ? (
          <div className="space-y-1">
            {filteredGames.map((game) => (
              <GameCard key={game.game_id} game={game} />
            ))}
            {filteredGames.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-bg-card border border-border-primary mb-4">
                  <Search size={24} className="text-text-tertiary" />
                </div>
                <p className="text-text-secondary font-medium">No games found</p>
                <p className="text-text-tertiary text-sm">Try adjusting your filters</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-bg-card border border-border-primary rounded-3xl h-[400px] flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-accent-dim rounded-full flex items-center justify-center mb-6">
              <MapIcon size={32} className="text-accent-primary" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Map View Coming Soon</h3>
            <p className="text-text-secondary text-sm">We're working on a real-time map of Berkeley courts.</p>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSurvey && (
          <SkillSurvey 
            isOpen={showSurvey} 
            onClose={() => setShowSurvey(false)} 
            onComplete={handleSurveyComplete} 
          />
        )}
        {showMatchmaker && (
          <Matchmaker onClose={() => setShowMatchmaker(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
