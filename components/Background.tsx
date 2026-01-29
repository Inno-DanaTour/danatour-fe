import React from 'react';
import { motion } from 'framer-motion';
import { ZoneType, AppState } from '../types';
import { COLORS } from '../constants';

interface BackgroundProps {
  currentZone: ZoneType;
}

const Background: React.FC<BackgroundProps> = ({ currentZone }) => {
  return (
    <div className="fixed inset-0 z-0 transition-colors duration-[1500ms] ease-in-out pointer-events-none overflow-hidden"
      style={{ backgroundColor: COLORS[currentZone].bg }}
    >
      {/* Ambient Gradients - Deep Ocean */}
      <motion.div 
        className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full opacity-30 blur-[100px]"
        animate={{
          backgroundColor: currentZone === ZoneType.SEA ? '#155E75' : currentZone === ZoneType.CITY ? '#4C1D95' : '#065F46',
          x: [0, 50, -50, 0],
          y: [0, -30, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
      />

      <motion.div 
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-20 blur-[120px]"
        animate={{
          backgroundColor: currentZone === ZoneType.SEA ? '#0EA5E9' : currentZone === ZoneType.CITY ? '#DB2777' : '#D97706',
          x: [0, -30, 30, 0],
          y: [0, 50, -50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "mirror" }}
      />
      
      {/* Noise Overlay for texture */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
    </div>
  );
};

export default Background;