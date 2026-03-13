import React from 'react';
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';
import { GAMES, getCourtById, CURRENT_USER, GAME_PARTICIPANTS } from '../data/mockData';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function UpcomingScreen() {
  // Get games where current user is a participant or host
  const userGameIds = GAME_PARTICIPANTS
    .filter(p => p.user_id === CURRENT_USER.user_id && p.join_status === 'approved')
    .map(p => p.game_id);
  
  const hostedGames = GAMES.filter(g => g.host_id === CURRENT_USER.user_id);
  const joinedGames = GAMES.filter(g => userGameIds.includes(g.game_id));
  
  const allUpcoming = [...hostedGames, ...joinedGames]
    .filter(g => new Date(g.scheduled_start_time) > new Date())
    .sort((a, b) => new Date(a.scheduled_start_time).getTime() - new Date(b.scheduled_start_time).getTime());

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto px-4 pt-8"
    >
      <h1 className="text-2xl font-black tracking-tight mb-8">Upcoming Runs</h1>

      {allUpcoming.length > 0 ? (
        <div className="space-y-4">
          {allUpcoming.map((game) => {
            const court = getCourtById(game.court_id);
            const isHost = game.host_id === CURRENT_USER.user_id;
            
            return (
              <Link 
                key={game.game_id}
                to={`/game/${game.game_id}`}
                className="block bg-bg-card border border-border-primary rounded-2xl p-5 hover:border-accent-primary/30 transition-all relative overflow-hidden"
              >
                {isHost && (
                  <div className="absolute top-0 right-0 bg-accent-primary text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-lg">
                    Hosting
                  </div>
                )}
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-accent-dim flex flex-col items-center justify-center text-accent-primary border border-accent-muted">
                    <span className="text-[10px] font-black uppercase leading-none mb-1">{format(new Date(game.scheduled_start_time), 'MMM')}</span>
                    <span className="text-xl font-black leading-none">{format(new Date(game.scheduled_start_time), 'd')}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary leading-tight mb-1">{court?.court_name}</h3>
                    <div className="flex items-center text-text-tertiary text-xs gap-3">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{format(new Date(game.scheduled_start_time), 'h:mm a')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span>{court?.city}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border-primary/50">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-bg-card bg-bg-elevated flex items-center justify-center text-[8px] font-bold text-text-tertiary">
                        {i}
                      </div>
                    ))}
                    <div className="w-6 h-6 rounded-full border-2 border-bg-card bg-accent-dim flex items-center justify-center text-[8px] font-bold text-accent-primary">
                      +4
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-accent-primary text-xs font-bold">
                    <span>Details</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24">
          <div className="w-20 h-20 bg-bg-card border border-border-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar size={32} className="text-text-tertiary" />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">No upcoming runs</h3>
          <p className="text-text-secondary text-sm mb-8">You haven't joined or hosted any games yet.</p>
          <Link 
            to="/"
            className="inline-block bg-accent-primary text-white font-black px-8 py-3 rounded-xl shadow-lg accent-glow"
          >
            EXPLORE GAMES
          </Link>
        </div>
      )}
    </motion.div>
  );
}
