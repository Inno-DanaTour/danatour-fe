import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stamp, Volume2, VolumeX } from 'lucide-react';

interface PassportProps {
  collectedStamps: string[];
  totalLocations: number;
  isMuted: boolean;
  toggleAudio: () => void;
}

const Passport: React.FC<PassportProps> = ({ collectedStamps, totalLocations, isMuted, toggleAudio }) => {
  const progress = (collectedStamps.length / totalLocations) * 100;

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Sound Toggle */}
      <button 
        onClick={toggleAudio}
        className="p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/10 transition-colors"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {/* Passport Widget */}
      <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 w-64 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold uppercase tracking-wider text-xs">Travel Passport</h3>
          <span className="text-[#FFC857] font-mono text-xs">{collectedStamps.length}/{totalLocations}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-white/10 rounded-full mb-4 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#FFC857] to-[#F59E0B]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 50 }}
          />
        </div>

        {/* Stamps Grid */}
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: totalLocations }).map((_, i) => {
            const isCollected = i < collectedStamps.length;
            return (
              <div 
                key={i} 
                className={`aspect-square rounded-full flex items-center justify-center border ${isCollected ? 'border-[#FFC857] bg-[#FFC857]/20' : 'border-white/10 bg-white/5'}`}
              >
                 <AnimatePresence>
                    {isCollected && (
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="text-[#FFC857]"
                      >
                        <Stamp size={12} />
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Passport;