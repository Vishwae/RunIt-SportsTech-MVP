import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, Users, Info, ChevronDown, Trophy, DollarSign } from 'lucide-react';
import { COURTS, Sport } from '../data/mockData';
import { motion } from 'motion/react';

const SPORTS: Sport[] = ['Basketball', 'Soccer', 'Pickleball', 'Tennis', 'Volleyball'];

export default function CreateGameScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    court_id: '',
    sport: 'Basketball' as Sport,
    date: '',
    time: '',
    skill_level: 'Intermediate',
    max_players: '10',
    description: '',
    fee: '2',
    is_wager: false,
    wager_amount: '5',
  });

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else {
      // Submit logic
      navigate('/');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto px-4 pt-8 pb-20"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => step === 1 ? navigate(-1) : setStep(1)}
          className="w-10 h-10 rounded-xl bg-bg-card border border-border-primary flex items-center justify-center text-text-primary"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Run a Game</h1>
          <p className="text-xs text-text-tertiary font-bold uppercase tracking-widest">Step {step} of 2</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-bg-card rounded-full mb-8 overflow-hidden">
        <motion.div 
          initial={{ width: '50%' }}
          animate={{ width: step === 1 ? '50%' : '100%' }}
          className="h-full bg-accent-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]"
        />
      </div>

      {step === 1 ? (
        <div className="space-y-6">
          {/* Sport Selection */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-text-tertiary mb-3 px-1">Select Sport</label>
            <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
              {SPORTS.map((sport) => (
                <button
                  key={sport}
                  onClick={() => setFormData({ ...formData, sport })}
                  className={`px-5 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all border ${
                    formData.sport === sport 
                      ? 'bg-accent-primary border-accent-primary text-white shadow-lg' 
                      : 'bg-bg-card border-border-primary text-text-tertiary'
                  }`}
                >
                  {sport}
                </button>
              ))}
            </div>
          </div>

          {/* Court Selection */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-text-tertiary mb-3 px-1">Select Court</label>
            <div className="space-y-3">
              {COURTS.filter(c => c.supported_sports.includes(formData.sport)).map((court) => (
                <button
                  key={court.court_id}
                  onClick={() => setFormData({ ...formData, court_id: court.court_id })}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                    formData.court_id === court.court_id 
                      ? 'bg-accent-dim border-accent-primary' 
                      : 'bg-bg-card border-border-primary hover:border-text-tertiary'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    formData.court_id === court.court_id ? 'bg-accent-primary text-white' : 'bg-bg-elevated text-text-tertiary'
                  }`}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${formData.court_id === court.court_id ? 'text-accent-primary' : 'text-text-primary'}`}>
                      {court.court_name}
                    </p>
                    <p className="text-xs text-text-tertiary">{court.address}</p>
                  </div>
                </button>
              ))}
              {COURTS.filter(c => c.supported_sports.includes(formData.sport)).length === 0 && (
                <p className="text-xs text-text-tertiary italic p-4 text-center bg-bg-card rounded-2xl border border-dashed border-border-primary">
                  No courts found for {formData.sport} in this area.
                </p>
              )}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-text-tertiary mb-3 px-1">Date</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input 
                  type="date" 
                  className="w-full bg-bg-card border border-border-primary rounded-xl py-3 pl-11 pr-4 text-sm text-text-primary focus:border-accent-primary outline-none"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-text-tertiary mb-3 px-1">Time</label>
              <div className="relative">
                <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input 
                  type="time" 
                  className="w-full bg-bg-card border border-border-primary rounded-xl py-3 pl-11 pr-4 text-sm text-text-primary focus:border-accent-primary outline-none"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Skill Level */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-text-tertiary mb-3 px-1">Skill Level</label>
            <div className="grid grid-cols-3 gap-2">
              {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                <button
                  key={level}
                  onClick={() => setFormData({ ...formData, skill_level: level as any })}
                  className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                    formData.skill_level === level 
                      ? 'bg-accent-primary border-accent-primary text-white' 
                      : 'bg-bg-card border-border-primary text-text-tertiary'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Max Players */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-text-tertiary mb-3 px-1">Max Players</label>
            <div className="relative">
              <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <select 
                className="w-full bg-bg-card border border-border-primary rounded-xl py-3 pl-11 pr-10 text-sm text-text-primary focus:border-accent-primary outline-none appearance-none"
                value={formData.max_players}
                onChange={(e) => setFormData({ ...formData, max_players: e.target.value })}
              >
                {[2, 4, 6, 8, 10, 12, 15, 20, 22].map(n => (
                  <option key={n} value={n}>{n} Players</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
            </div>
          </div>

          {/* Wager Section */}
          <div className="bg-bg-card border border-border-primary rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.is_wager ? 'bg-status-yellow text-black' : 'bg-bg-elevated text-text-tertiary'}`}>
                  <Trophy size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">Wager Mode</p>
                  <p className="text-[10px] text-text-tertiary uppercase font-black tracking-widest">Winner takes all</p>
                </div>
              </div>
              <button 
                onClick={() => setFormData({ ...formData, is_wager: !formData.is_wager })}
                className={`w-12 h-6 rounded-full transition-colors relative ${formData.is_wager ? 'bg-status-yellow' : 'bg-bg-elevated'}`}
              >
                <motion.div 
                  animate={{ x: formData.is_wager ? 24 : 4 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>

            {formData.is_wager && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="pt-4 border-t border-border-primary"
              >
                <label className="block text-xs font-black uppercase tracking-widest text-text-tertiary mb-3 px-1">Buy-in Amount (Per Person)</label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" />
                  <input 
                    type="number"
                    min="1"
                    className="w-full bg-bg-elevated border border-border-primary rounded-xl py-3 pl-11 pr-4 text-sm text-text-primary focus:border-status-yellow outline-none"
                    value={formData.wager_amount}
                    onChange={(e) => setFormData({ ...formData, wager_amount: e.target.value })}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-text-tertiary uppercase tracking-widest">USD</span>
                </div>
                <p className="mt-3 text-[10px] text-status-yellow/80 font-medium leading-tight">
                  Total pot will be approximately <span className="font-black">${parseInt(formData.wager_amount || '0') * parseInt(formData.max_players)}</span> based on player count.
                </p>
              </motion.div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-text-tertiary mb-3 px-1">Description</label>
            <div className="relative">
              <Info size={16} className="absolute left-4 top-4 text-text-tertiary" />
              <textarea 
                placeholder="What should players know? (e.g. Bring water, full court, etc.)"
                className="w-full bg-bg-card border border-border-primary rounded-xl py-3.5 pl-11 pr-4 text-sm text-text-primary focus:border-accent-primary outline-none min-h-[120px] resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer Action */}
      <div className="mt-12">
        <button 
          onClick={handleNext}
          disabled={step === 1 && !formData.court_id}
          className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all transform active:scale-95 ${
            step === 1 && !formData.court_id 
              ? 'bg-text-tertiary cursor-not-allowed' 
              : 'bg-accent-primary accent-glow'
          }`}
        >
          {step === 1 ? 'CONTINUE' : 'CREATE RUN'}
        </button>
      </div>
    </motion.div>
  );
}
