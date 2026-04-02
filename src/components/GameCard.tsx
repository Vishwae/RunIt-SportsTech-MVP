import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Clock, ChevronRight, DollarSign, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { Game, getCourtById, getUserById, getParticipantsForGame, CURRENT_USER } from '../data/mockData';
import { motion } from 'motion/react';

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const court = getCourtById(game.court_id);
  const host = getUserById(game.host_id);
  const participants = getParticipantsForGame(game.game_id);
  const approvedCount = participants.filter(p => p.join_status === 'approved').length;
  const isSkillMatch = game.skill_level === CURRENT_USER.skill_level;

  const skillColors = {
    Beginner: 'bg-status-green-muted text-status-green',
    Intermediate: 'bg-status-yellow-muted text-status-yellow',
    Advanced: 'bg-status-red-muted text-status-red',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="mb-4"
    >
      <Link 
        to={`/game/${game.game_id}`}
        className={`block bg-bg-card border rounded-2xl p-4 transition-all ${
          isSkillMatch ? 'border-accent-primary/40 shadow-lg shadow-accent-primary/5' : 'border-border-primary'
        }`}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-accent-primary bg-accent-dim px-2 py-0.5 rounded">
                {game.sport}
              </span>
              {isSkillMatch && (
                <span className="text-[10px] font-black uppercase tracking-widest text-status-blue bg-status-blue-muted px-2 py-0.5 rounded flex items-center gap-1">
                  <Trophy size={10} /> Skill Match
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-text-primary leading-tight mb-1">
              {court?.court_name}
            </h3>
            <div className="flex items-center text-text-tertiary text-xs">
              <MapPin size={12} className="mr-1" />
              <span className="truncate max-w-[200px]">{court?.address}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${skillColors[game.skill_level]}`}>
              {game.skill_level}
            </span>
            {game.is_wager && (
              <span className="text-[10px] font-black text-status-yellow bg-status-yellow-muted px-2 py-1 rounded-lg flex items-center gap-1">
                <Trophy size={10} /> ${game.wager_amount} Wager
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-text-secondary text-sm">
            <Clock size={14} className="mr-2 text-accent-primary" />
            <span>{format(new Date(game.scheduled_start_time), 'h:mm a')}</span>
          </div>
          <div className="flex items-center text-text-secondary text-sm">
            <Users size={14} className="mr-2 text-accent-primary" />
            <span>{approvedCount} / {game.max_players} joined</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border-primary/50">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-accent-dim flex items-center justify-center text-[10px] font-bold text-accent-primary border border-accent-muted mr-2 overflow-hidden">
              {host?.profile_photo_url ? (
                <img src={host.profile_photo_url} alt={host.full_name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                host?.full_name.charAt(0)
              )}
            </div>
            <span className="text-xs text-text-tertiary">Hosted by <span className="text-text-secondary font-medium">{host?.full_name}</span></span>
          </div>
          <ChevronRight size={16} className="text-text-tertiary" />
        </div>
      </Link>
    </motion.div>
  );
};

export default GameCard;
