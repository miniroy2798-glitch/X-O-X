import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Square } from './components/Square';
import { Player } from './types';
import { calculateWinner } from './utils';

export default function App() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [scores, setScores] = useState({ X: 0, O: 0, Draws: 0 });

  const winInfo = calculateWinner(board);
  const winner = winInfo?.winner;
  const winningLine = winInfo?.line;
  const isDraw = !winner && board.every((square) => square !== null);

  useEffect(() => {
    if (winner) {
      setScores(s => ({ ...s, [winner]: s[winner as 'X' | 'O'] + 1 }));
    } else if (isDraw) {
      setScores(s => ({ ...s, Draws: s.Draws + 1 }));
    }
  }, [winner, isDraw]);

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0, Draws: 0 });
    resetGame();
    setXIsNext(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] font-serif flex flex-col overflow-hidden selection:bg-[#D4AF37]/30">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-0 px-8 py-6 md:px-12 md:py-8 border-b border-white/10">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-1">Grandmaster Series</span>
          <h1 className="text-3xl font-light tracking-tighter text-[#D4AF37]">X <span className="text-white/20">/</span> O <span className="text-white/20">/</span> X</h1>
        </div>
        <div className="flex gap-8 md:gap-16">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1 text-nowrap">Player I (X)</p>
            <p className="text-2xl font-light">{scores.X.toString().padStart(2, '0')} <span className="text-xs text-white/20 ml-1">WINS</span></p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Draws</p>
            <p className="text-2xl font-light">{scores.Draws.toString().padStart(2, '0')}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1 text-nowrap">Player II (O)</p>
            <p className="text-2xl font-light">{scores.O.toString().padStart(2, '0')} <span className="text-xs text-white/20 ml-1">WINS</span></p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center relative p-6">
        
        {/* Left Desktop Sidebar */}
        <div className="hidden lg:flex absolute left-12 top-1/2 -translate-y-1/2 flex-col gap-8 opacity-40">
          <div className="text-[11px] tracking-[0.2em] uppercase [writing-mode:vertical-rl] rotate-180">Match History</div>
          <div className="w-[1px] h-32 bg-white/20 mx-auto"></div>
        </div>

        {/* Center Board */}
        <div className="relative flex flex-col items-center w-full max-w-sm">
          <div className="grid grid-cols-3 gap-0 border border-white/5 bg-white/[0.02] shadow-2xl w-full aspect-square">
            {board.map((square, i) => (
              <Square
                key={i}
                value={square}
                onClick={() => handleClick(i)}
                isWinningSquare={winningLine?.includes(i) ?? false}
                disabled={!!winner || isDraw}
              />
            ))}
          </div>
          
          <div className="mt-12 flex flex-col items-center h-24 text-center">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#D4AF37] mb-4">Match Status</p>
            <motion.p
              key={winner ? "win" : isDraw ? "draw" : "turn"}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg font-light text-white/60 max-w-xs leading-relaxed"
            >
              {winner 
                ? `Player ${winner === 'X' ? 'I' : 'II'} has established dominance. Match point.` 
                : isDraw 
                ? "The grid is exhausted. Stalemate reached." 
                : `Player ${xIsNext ? 'I' : 'II'}'s turn to move.`}
            </motion.p>
          </div>
        </div>

        {/* Right Desktop Sidebar */}
        <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col gap-6">
          <div className="p-6 border border-white/10 bg-white/[0.03] backdrop-blur-sm w-48">
            <p className="text-[9px] uppercase tracking-widest text-white/40 mb-3">Current Turn</p>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${winner || isDraw ? 'bg-white/20' : 'bg-[#D4AF37] animate-pulse'}`}></div>
              <span className="text-sm uppercase tracking-widest text-[#E0E0E0]/80">
                {winner ? 'Match Ended' : isDraw ? 'Stalemate' : `Player ${xIsNext ? 'I' : 'II'}`}
              </span>
            </div>
          </div>
          <div className="p-6 border border-white/10 bg-white/[0.03] backdrop-blur-sm w-48">
            <p className="text-[9px] uppercase tracking-widest text-white/40 mb-3">Total Moves</p>
            <span className="text-sm uppercase tracking-widest text-[#E0E0E0]/80">{board.filter(Boolean).length}</span>
          </div>
        </div>
      </main>

      <footer className="flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-6 md:px-12 md:py-8 border-t border-white/10">
        <div className="flex gap-4 sm:gap-8 text-[11px] uppercase tracking-widest text-white/50">
          <span className="hidden sm:inline">Session Active</span>
          <span className="hidden sm:inline">Difficulty: Master</span>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <button
            onClick={resetScores}
            className="flex-1 sm:flex-none px-6 py-3 border border-white/10 text-white/60 text-xs uppercase tracking-[0.2em] hover:bg-white/[0.03] hover:text-white transition-colors"
          >
            Reset Stats
          </button>
          <button
            onClick={resetGame}
            className="flex-1 sm:flex-none px-6 py-3 border border-[#D4AF37] bg-[#D4AF37]/5 text-[#D4AF37] text-xs uppercase tracking-[0.2em] hover:bg-[#D4AF37] hover:text-black transition-all"
          >
            New Match
          </button>
        </div>
      </footer>
    </div>
  );
}
