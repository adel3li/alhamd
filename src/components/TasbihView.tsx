import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Heart } from 'lucide-react';
import { haptics } from '../services/haptics';

export const TasbihView: React.FC = () => {
  const { state, updateSettings } = useStore();
  const [sessionCount, setSessionCount] = useState(0);

  const handleTap = () => {
    setSessionCount(prev => prev + 1);
    updateSettings({ tasbihCount: (state.tasbihCount || 0) + 1 });
    // Light vibration on every tap
    if (state.hapticReminders || true) {
      if ((sessionCount + 1) % 33 === 0) {
        haptics.heavy();
      } else {
        haptics.light();
      }
    }
  };

  const handleReset = () => {
    setSessionCount(0);
    haptics.heavy();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-brand-background dark:bg-brand-dark-background overflow-hidden relative">
      <div className="px-6 pt-12 pb-6 z-10 text-center">
        <h1 className="text-2xl font-bold font-sans">مسبحة الحمد</h1>
        <p className="text-sm text-brand-textSecondary dark:text-brand-dark-textSecondary mt-1">
          إجمالي الحمد: {state.tasbihCount.toLocaleString('ar-EG')}
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative p-6">
        <div className="relative flex items-center justify-center">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleTap}
            className="w-64 h-64 rounded-full bg-brand-surface dark:bg-brand-dark-surface shadow-[0_0_40px_rgba(0,0,0,0.05)] border-4 border-brand-primary/20 flex flex-col items-center justify-center relative z-20 outline-none"
          >
            <span className="text-6xl font-bold text-brand-primary dark:text-brand-dark-primary tabular-nums">
              {sessionCount.toLocaleString('ar-EG')}
            </span>
            <span className="text-sm font-medium text-brand-textSecondary mt-2">
              الحمدلله
            </span>
          </motion.button>
          
          {/* Decorative background ripples */}
          <div className="absolute inset-0 bg-brand-primary/5 rounded-full blur-2xl scale-150 -z-10"></div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="mt-16 w-12 h-12 rounded-full bg-brand-textPrimary/5 dark:bg-brand-dark-textPrimary/5 text-brand-textPrimary dark:text-brand-dark-textPrimary flex items-center justify-center transition-colors hover:bg-brand-textPrimary/10 border border-brand-textPrimary/10"
        >
          <RefreshCw className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};
