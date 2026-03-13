import React, { useState } from 'react';
import { Users, Shuffle, RefreshCw } from 'lucide-react';
import { generateRandomTeams, getUserById, GameParticipant } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';

interface TeamGeneratorProps {
  gameId: string;
}

export default function TeamGenerator({ gameId }: TeamGeneratorProps) {
  const [teams, setTeams] = useState<GameParticipant[][] | null>(null);
  const [numTeams, setNumTeams] = useState(2);

  const handleGenerate = () => {
    const generatedTeams = generateRandomTeams(gameId, numTeams);
    setTeams(generatedTeams);
  };

  return (
    <div className="bg-bg-card border border-border-primary rounded-3xl p-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Shuffle size={20} className="text-accent-primary" />
          <h3 className="text-lg font-black tracking-tight">Team Generator</h3>
        </div>
        <div className="flex items-center gap-2 bg-bg-elevated rounded-xl p-1 border border-border-primary">
          {[2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setNumTeams(n)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                numTeams === n ? 'bg-accent-primary text-white shadow-md' : 'text-text-tertiary'
              }`}
            >
              {n} Teams
            </button>
          ))}
        </div>
      </div>

      {!teams ? (
        <div className="text-center py-8">
          <p className="text-text-secondary text-sm mb-6">
            Randomly assign players to balanced teams.
          </p>
          <button
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary text-white rounded-2xl font-black text-sm shadow-xl accent-glow transform active:scale-95 transition-all"
          >
            <Shuffle size={18} />
            GENERATE TEAMS
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {teams.map((team, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-bg-elevated border border-border-primary rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-accent-primary">Team {idx + 1}</h4>
                  <span className="text-[10px] font-bold text-text-tertiary">{team.length} Players</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {team.map((p) => {
                    const user = getUserById(p.user_id);
                    return (
                      <div
                        key={p.user_id}
                        className="flex items-center gap-2 bg-bg-card border border-border-primary rounded-xl px-3 py-2"
                      >
                        <img
                          src={user?.profile_photo_url || ''}
                          alt={user?.full_name}
                          className="w-5 h-5 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-xs font-bold text-text-primary">{user?.full_name.split(' ')[0]}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
          
          <button
            onClick={handleGenerate}
            className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-accent-primary hover:bg-accent-dim rounded-xl transition-all"
          >
            <RefreshCw size={14} />
            RESHUFFLE TEAMS
          </button>
        </div>
      )}
    </div>
  );
}
