import { motion } from 'motion/react';
import { Player } from '../types';

interface SquareProps {
  value: Player;
  onClick: () => void;
  isWinningSquare: boolean;
  disabled: boolean;
}

export function Square({ value, onClick, isWinningSquare, disabled }: SquareProps) {
  return (
    <button
      className={`aspect-square w-full border border-white/10 flex items-center justify-center text-5xl sm:text-7xl font-light cursor-pointer transition-colors duration-200 ${
        isWinningSquare ? 'bg-[#D4AF37]/10' : 'hover:bg-white/[0.03]'
      } ${disabled && !isWinningSquare ? 'cursor-default' : ''}`}
      onClick={onClick}
      disabled={disabled || value !== null}
    >
      {value && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={value === 'X' ? 'text-[#D4AF37]' : 'text-white/80 italic'}
        >
          {value}
        </motion.span>
      )}
    </button>
  );
}
