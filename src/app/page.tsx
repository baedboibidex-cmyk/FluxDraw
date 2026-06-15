
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Wallet, Zap, Trophy } from "lucide-react";

export default function Home() {
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<"idle" | "win" | "lose">("idle");
  const [multiplier, setMultiplier] = useState(1);

  const handleBet = () => {
    if (balance < betAmount || isSpinning) return;
    
    setBalance((prev) => prev - betAmount);
    setIsSpinning(true);
    setResult("idle");
    setMultiplier(1);

    // Animate multiplier
    const interval = setInterval(() => {
      setMultiplier((prev) => Math.min(prev + 0.1, 5));
    }, 100);

    // Mock game logic
    setTimeout(() => {
      clearInterval(interval);
      const isWin = Math.random() > 0.5;
      
      if (isWin) {
        const winAmount = betAmount * multiplier;
        setBalance((prev) => prev + winAmount);
        setResult("win");
      } else {
        setResult("lose");
      }
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white p-4 md:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-xl flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              FLUXDRAW
            </h1>
          </div>
          
          <div className="flex items-center gap-2 bg-white/5 px-6 py-3 rounded-full border border-white/10 backdrop-blur-sm">
            <Wallet className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-400 font-mono font-bold text-lg">${balance.toFixed(2)}</span>
          </div>
        </motion.div>

        {/* Main Game Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative bg-gradient-to-b from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 md:p-12 backdrop-blur-xl overflow-hidden"
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 opacity-0 hover:opacity-100 transition-opacity duration-500" />

          {/* Game Display */}
          <div className="relative text-center space-y-6">
            {result === "idle" && !isSpinning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <p className="text-gray-400 text-xl">Place your bet and watch the multiplier rise</p>
                <div className="text-6xl md:text-8xl font-black text-white/20">
                  {multiplier.toFixed(1)}x
                </div>
              </motion.div>
            )}
            
            {isSpinning && (
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-4"
              >
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400"
                >
                  {multiplier.toFixed(1)}x
                </motion.div>
                <p className="text-gray-400 animate-pulse">CASH OUT BEFORE IT CRASHES!</p>
              </motion.div>
            )}
            
            {result === "win" && !isSpinning && (
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center gap-3">
                  <Trophy className="w-16 h-16 text-yellow-400" />
                </div>
                <div className="text-6xl md:text-8xl font-black text-green-400">
                  +${(betAmount * multiplier).toFixed(2)}
                </div>
                <p className="text-2xl text-gray-400">Cashed out at {multiplier.toFixed(1)}x!</p>
              </motion.div>
            )}

            {result === "lose" && !isSpinning && (
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-4"
              >
                <div className="text-6xl md:text-8xl font-black text-red-500">
                  CRASHED!
                </div>
                <p className="text-2xl text-gray-400">Better luck next time</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Betting Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 font-medium">Bet Amount</span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setBetAmount(Math.max(1, betAmount - 10))}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-bold transition-colors"
                >
                  -
                </button>
                <span className="text-3xl font-mono font-bold text-white w-24 text-center">
                  ${betAmount}
                </span>
                <button 
                  onClick={() => setBetAmount(betAmount + 10)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSpinning || balance < betAmount}
              onClick={handleBet}
              className="w-full py-6 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-black text-2xl tracking-wider shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-purple-500/40 transition-shadow"
            >
              {isSpinning ? "SPINNING..." : "PLACE BET"}
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-4"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
            <p className="text-gray-400 text-sm mb-1">Total Wins</p>
            <p className="text-2xl font-bold text-green-400">0</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
            <p className="text-gray-400 text-sm mb-1">Biggest Win</p>
            <p className="text-2xl font-bold text-cyan-400">$0</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
            <p className="text-gray-400 text-sm mb-1">Games Played</p>
            <p className="text-2xl font-bold text-purple-400">0</p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
