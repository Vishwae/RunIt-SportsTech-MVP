import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, Shield, MessageCircle, Share2, Info, DollarSign, AlertCircle, CheckCircle2, Trophy } from 'lucide-react';
import { GAMES, getCourtById, getUserById, getParticipantsForGame, CURRENT_USER, joinGame, cancelParticipation } from '../data/mockData';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import TeamGenerator from '../components/TeamGenerator';

export default function GameDetailsScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isBooking, setIsBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState<'details' | 'payment' | 'success'>('details');
  const [refreshKey, setRefreshKey] = useState(0); // Simple way to trigger re-render
  
  const game = GAMES.find(g => g.game_id === id);
  
  if (!game) return <div className="p-8 text-center">Game not found</div>;

  const court = getCourtById(game.court_id);
  const host = getUserById(game.host_id);
  const participants = getParticipantsForGame(game.game_id);
  const approvedParticipants = participants.filter(p => p.join_status === 'approved');
  const waitlistedParticipants = participants.filter(p => p.join_status === 'waitlisted');
  
  const isFull = approvedParticipants.length >= game.max_players;
  const userParticipant = participants.find(p => p.user_id === CURRENT_USER.user_id);

  const handleJoin = () => {
    if (game.fee > 0) {
      setBookingStep('payment');
    } else {
      joinGame(game.game_id, CURRENT_USER.user_id);
      setBookingStep('success');
      setRefreshKey(prev => prev + 1);
    }
    setIsBooking(true);
  };

  const confirmPayment = () => {
    joinGame(game.game_id, CURRENT_USER.user_id);
    setBookingStep('success');
    setRefreshKey(prev => prev + 1);
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to leave this game?')) {
      cancelParticipation(game.game_id, CURRENT_USER.user_id);
      setRefreshKey(prev => prev + 1);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-md mx-auto pb-10"
    >
      {/* Hero Header */}
      <div className="relative h-64 bg-accent-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent z-10" />
        <img 
          src={`https://picsum.photos/seed/${game.game_id}/800/600`} 
          alt="Court" 
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        
        <div className="absolute top-6 left-4 right-4 z-20 flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full glass flex items-center justify-center text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full glass flex items-center justify-center text-white">
              <Share2 size={18} />
            </button>
            <button className="w-10 h-10 rounded-full glass flex items-center justify-center text-white">
              <MessageCircle size={18} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 left-4 right-4 z-20">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-accent-primary text-[10px] font-black uppercase tracking-widest text-white">
              {game.sport}
            </span>
            <span className="px-2 py-0.5 rounded bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-white">
              {game.skill_level}
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight leading-tight">
            {court?.court_name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-4 relative z-30">
        <div className="bg-bg-card border border-border-primary rounded-3xl p-6 shadow-2xl space-y-6">
          {/* Commitment Fee Alert */}
          {game.fee > 0 && (
            <div className="bg-status-green-muted border border-status-green/20 rounded-2xl p-4 flex items-start gap-3">
              <DollarSign size={20} className="text-status-green shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-status-green">${game.fee} Commitment Fee</p>
                <p className="text-[10px] text-status-green/80 leading-tight mt-0.5">
                  To ensure everyone shows up, a small fee is required. This is refunded if you attend or if the game is cancelled.
                </p>
              </div>
            </div>
          )}

          {/* Wager Alert */}
          {game.is_wager && (
            <div className="bg-status-yellow-muted border border-status-yellow/20 rounded-2xl p-4 flex items-start gap-3">
              <Trophy size={20} className="text-status-yellow shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-status-yellow">Wager Game: ${game.wager_amount} Buy-in</p>
                <p className="text-[10px] text-status-yellow/80 leading-tight mt-0.5">
                  This is a competitive run with a cash prize. The total pot of <span className="font-black">${(game.wager_amount || 0) * game.max_players}</span> goes to the winning team!
                </p>
              </div>
            </div>
          )}

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-dim flex items-center justify-center text-accent-primary">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-text-tertiary tracking-wider">Time</p>
                <p className="text-sm font-bold text-text-primary">{format(new Date(game.scheduled_start_time), 'h:mm a')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-dim flex items-center justify-center text-accent-primary">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-text-tertiary tracking-wider">Players</p>
                <p className="text-sm font-bold text-text-primary">{approvedParticipants.length} / {game.max_players}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-dim flex items-center justify-center text-accent-primary shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-text-tertiary tracking-wider">Location</p>
              <p className="text-sm font-bold text-text-primary">{court?.address}</p>
              <p className="text-xs text-text-tertiary mt-0.5">{court?.city}, {court?.state}</p>
            </div>
          </div>

          {/* Waitlist Info */}
          {isFull && (
            <div className="bg-status-yellow-muted border border-status-yellow/20 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-status-yellow shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-status-yellow">Game is Full</p>
                <p className="text-[10px] text-status-yellow/80 leading-tight mt-0.5">
                  You can join the waitlist. If someone drops out, you'll be automatically moved to the player list.
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-text-tertiary mb-2 flex items-center gap-2">
              <Info size={14} /> About this run
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              {game.description}
            </p>
          </div>

          {/* Participants */}
          <div className="pt-6 border-t border-border-primary">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-text-tertiary">Players ({approvedParticipants.length})</h3>
              <button className="text-xs font-bold text-accent-primary">See All</button>
            </div>
            <div className="flex -space-x-3 overflow-hidden">
              {approvedParticipants.map((p, i) => {
                const user = getUserById(p.user_id);
                return (
                  <div 
                    key={p.user_id} 
                    className="w-10 h-10 rounded-full border-2 border-bg-card bg-bg-elevated flex items-center justify-center text-xs font-bold text-text-secondary overflow-hidden"
                    style={{ zIndex: 10 - i }}
                  >
                    {user?.full_name.charAt(0)}
                  </div>
                );
              })}
            </div>
          </div>

          {waitlistedParticipants.length > 0 && (
            <div className="pt-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mb-3">Waitlist ({waitlistedParticipants.length})</h3>
              <div className="flex gap-2">
                {waitlistedParticipants.map(p => {
                  const user = getUserById(p.user_id);
                  return (
                    <div key={p.user_id} className="w-8 h-8 rounded-full bg-bg-elevated border border-border-primary flex items-center justify-center text-[10px] font-bold text-text-tertiary">
                      {user?.full_name.charAt(0)}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Team Generator */}
          {approvedParticipants.length >= 2 && (
            <TeamGenerator gameId={game.game_id} />
          )}
        </div>

        {/* Action Button */}
        <div className="mt-8">
          {userParticipant ? (
            <div className="space-y-3">
              <div className="bg-bg-card border border-border-primary rounded-2xl p-4 text-center">
                <p className="text-sm font-bold text-text-primary mb-1">
                  {userParticipant.join_status === 'approved' ? 'You are in!' : 'You are on the waitlist'}
                </p>
                {userParticipant.join_status === 'waitlisted' && (
                  <p className="text-xs font-bold text-accent-primary mb-1">
                    Position: #{waitlistedParticipants.findIndex(p => p.user_id === CURRENT_USER.user_id) + 1}
                  </p>
                )}
                <p className="text-xs text-text-tertiary">
                  {userParticipant.join_status === 'approved' ? 'See you at the court!' : 'We\'ll notify you if a spot opens up.'}
                </p>
              </div>
              <button 
                onClick={handleCancel}
                className="w-full py-3 text-sm font-bold text-status-red hover:bg-status-red-muted rounded-xl transition-colors"
              >
                Leave Game
              </button>
            </div>
          ) : (
            <button 
              onClick={handleJoin}
              className={`w-full font-black py-4 rounded-2xl shadow-xl accent-glow transition-all transform active:scale-95 ${
                isFull ? 'bg-bg-elevated text-text-primary border border-border-primary' : 'bg-accent-primary text-white'
              }`}
            >
              {isFull ? 'JOIN WAITLIST' : 'BOOK YOUR SPOT'}
            </button>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBooking && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-8 sm:items-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBooking(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="relative w-full max-w-sm bg-bg-card border border-border-primary rounded-[32px] p-8 shadow-2xl overflow-hidden"
            >
              {bookingStep === 'payment' && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-status-green-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <DollarSign size={32} className="text-status-green" />
                  </div>
                  <h3 className="text-2xl font-black text-text-primary mb-2">Secure Your Spot</h3>
                  <p className="text-text-secondary text-sm mb-8">
                    A <span className="text-text-primary font-bold">$2.00 commitment fee</span> is required to join this run.
                  </p>
                  
                  <div className="bg-bg-elevated rounded-2xl p-4 mb-8 text-left border border-border-primary">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-text-tertiary font-bold uppercase">Game Fee</span>
                      <span className="text-sm font-bold text-text-primary">$2.00</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-border-primary">
                      <span className="text-xs text-text-tertiary font-bold uppercase">Total</span>
                      <span className="text-lg font-black text-accent-primary">$2.00</span>
                    </div>
                  </div>

                  <button 
                    onClick={confirmPayment}
                    className="w-full bg-accent-primary text-white font-black py-4 rounded-2xl shadow-xl accent-glow mb-4"
                  >
                    PAY & JOIN
                  </button>
                  <button 
                    onClick={() => setIsBooking(false)}
                    className="w-full text-text-tertiary font-bold text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {bookingStep === 'success' && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-status-green-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={32} className="text-status-green" />
                  </div>
                  <h3 className="text-2xl font-black text-text-primary mb-2">You're Booked!</h3>
                  <p className="text-text-secondary text-sm mb-8">
                    {isFull ? "You've been added to the waitlist." : "Your spot is secured. See you on the court!"}
                  </p>
                  
                  <button 
                    onClick={() => setIsBooking(false)}
                    className="w-full bg-bg-elevated border border-border-primary text-text-primary font-black py-4 rounded-2xl"
                  >
                    DONE
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
