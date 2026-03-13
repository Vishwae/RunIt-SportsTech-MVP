import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, CheckCircle2, ChevronRight, Star, Info } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  options: { label: string; value: number }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'mindset',
    text: "When you step on the court, what's your mindset?",
    options: [
      { label: "Just here for the vibes and a good sweat", value: 1 },
      { label: "I play hard but keep it friendly", value: 2 },
      { label: "I'm focused on winning and improving", value: 3 },
      { label: "Total lockdown mode—I'm here to dominate", value: 4 },
    ],
  },
  {
    id: 'experience',
    text: "How many years have you been honing your craft?",
    options: [
      { label: "I'm just getting started!", value: 1 },
      { label: "A few years of consistent play", value: 2 },
      { label: "I've been a regular for a long time", value: 3 },
      { label: "It's been a lifelong passion", value: 4 },
    ],
  },
  {
    id: 'level',
    text: "What's the highest level of competition you've faced?",
    options: [
      { label: "Casual park runs and PE class", value: 1 },
      { label: "High school ball or competitive leagues", value: 2 },
      { label: "College-level intensity or semi-pro", value: 3 },
      { label: "Professional or elite academy training", value: 4 },
    ],
  },
  {
    id: 'frequency',
    text: "How often do you find yourself craving a game?",
    options: [
      { label: "Every once in a while", value: 1 },
      { label: "At least once a week to stay sharp", value: 2 },
      { label: "2-3 times a week—it's my routine", value: 3 },
      { label: "Every single day if I could", value: 4 },
    ],
  },
  {
    id: 'teammates',
    text: "How would your teammates describe your game?",
    options: [
      { label: "Enthusiastic and still learning", value: 1 },
      { label: "Reliable and solid contributor", value: 2 },
      { label: "High-impact player with great vision", value: 3 },
      { label: "The one who carries the team", value: 4 },
    ],
  },
];

interface SkillSurveyProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (level: 'Beginner' | 'Intermediate' | 'Advanced') => void;
}

export default function SkillSurvey({ isOpen, onClose, onComplete }: SkillSurveyProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [QUESTIONS[currentStep].id]: value };
    setAnswers(newAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate level
      const totalScore = Object.values(newAnswers).reduce((a, b) => (a as number) + (b as number), 0) as number;
      let level: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner';
      
      if (totalScore >= 16) level = 'Advanced';
      else if (totalScore >= 10) level = 'Intermediate';
      
      onComplete(level);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-bg-card border border-border-primary rounded-3xl p-8 overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/10 rounded-full -mr-16 -mt-16 blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent-dim flex items-center justify-center text-accent-primary">
                  <Trophy size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight">Skill Assessment</h2>
                  <p className="text-xs text-text-tertiary font-bold uppercase tracking-widest">
                    Question {currentStep + 1} of {QUESTIONS.length}
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-text-primary mb-6 leading-tight">
                  {QUESTIONS[currentStep].text}
                </h3>
                
                <div className="space-y-3">
                  {QUESTIONS[currentStep].options.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => handleAnswer(option.value)}
                      className="w-full flex items-center justify-between p-4 rounded-2xl bg-bg-elevated border border-border-primary hover:border-accent-primary hover:bg-accent-dim transition-all group text-left"
                    >
                      <span className="font-bold text-sm group-hover:text-accent-primary transition-colors">
                        {option.label}
                      </span>
                      <ChevronRight size={16} className="text-text-tertiary group-hover:text-accent-primary transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress dots */}
              <div className="flex justify-center gap-2">
                {QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === currentStep ? 'w-6 bg-accent-primary' : 'w-1.5 bg-border-primary'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
