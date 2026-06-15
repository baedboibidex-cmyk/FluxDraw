"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";
import confetti from "canvas-confetti";
import { Sparkles, Wallet, Zap, Trophy, TrendingUp, Volume2, VolumeX } from "lucide-react";

export default function Home() {
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);
  const [autoCashout, setAutoCashout] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<"idle" | "win" | "lose">("idle");
  const [multiplier, setMultiplier] = useState(1);
  const [crashPoint, setCrashPoint] = useState(0);
  const [stats, setStats] = useState({ wins: 0, biggestWin: 0, games: 0 });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [history, setHistory] = useState<number[]>([]);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const playSound = (type: "spin" | "win" | "lose" | "cashout") => {
    if (!soundEnabled) return;
    // In production, add actual sound files here
    console.log(`🔊 Playing ${type} sound`);
  };

  const handleBet = () => {
    if (balance < betAmount || isSpinning) return;
    
    setBalance((prev) => prev - betAmount);
    setIsSpinning(true);
    setResult("idle");
    setMultiplier(1);
    setStats(prev => ({ ...prev, games: prev.games + 1 }));
    
    // Generate random crash point (between 1.1x and 10x)
    const crash = (Math.random() * 9 + 1.1).toFixed(2);
    setCrashPoint(parseFloat(crash));

    // Game loop
    gameLoopRef.current = setInterval(() => {
      setMultiplier((prev) => {
        const newMult = prev + 0.01;
        
        // Check auto cashout
        if (autoCashout && newMult >= autoCashout && !isSpinning) {
          handleCashout(newMult);
          return newMult;
        }
        
        // Check crash
        if (newMult >= parseFloat(crash)) {
          handleCrash();
          return parseFloat(crash);
        }
        
        return newMult;
      });
    }, 50);

    playSound("spin");
  };

  const handleCashout = (currentMultiplier: number) => {
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    
    const winAmount = betAmount * currentMultiplier;
    setBalance((prev) => prev + winAmount);
    setResult("win");
    setIsSpinning(false);
    setHistory(prev => [currentMultiplier, ...prev].slice(0, 10));
    setStats(prev => ({
      wins: prev.wins + 1,
      biggestWin: Math.max(prev.biggestWin, winAmount),
      games: prev.games
    }));
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#06b6d4', '#22c55e']
    });
    
    playSound("win");
  };

  const handleCrash = () => {
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    setResult("lose");
    setIsSpinning(false);
    setHistory(prev => [crashPoint, ...prev].slice(0, 10));
    playSound("lose");
  };

  // 3D Animated Sphere Component
  function AnimatedSphere() {
    const meshRef = useRef<any>(null);
    
    useEffect(() => {
      if (!meshRef.current) return;
      const interval = setInterval(() => {
        meshRef.current.rotation.x += 0.01;
        meshRef.current.rotation.y += 0.01;
      }, 16);
      return () => clearInterval(interval);
    }, []);

    return (
      <Sphere ref={meshRef} args={[1, 100, 200]} scale={2}>
        <MeshDistortMaterial
          color={isSpinning ? "#a855f7" : result === "win" ? "#22c55e" : "#06b6d4"}
          attach="material"
          distort={isSpinning ? 0.6 : 0.3}
          speed={isSpinning ? 4 : 2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white p-4 md:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-6xl mx-auto space-y-6">
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
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2 bg-white/5 px-6 py-3 rounded-full border border-white/10 backdrop-blur-sm">
              <Wallet className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-400 font-mono font-bold text-lg">${balance.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Main Game Area - 2 Columns */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: 3D Game Display */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-gradient-to-b from-white/10 to-white/5 border border-white/20 rounded-3xl p-6 backdrop-blur-xl h-96 overflow-hidden"
          >
            <Canvas camera={{ position: [0, 0, 5] }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <AnimatedSphere />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
            </Canvas>
            
            {/* Overlay Stats */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <motion.div 
                  key={multiplier}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`text-7xl font-black ${isSpinning ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400' : result === 'win' ? 'text-green-400' : 'text-red-500'}`}
                >
                  {multiplier.toFixed(2)}x
                </motion.div>
                {isSpinning && <p className="text-gray-400 mt-2 animate-pulse">CRASH POINT: ???</p>}
              </div>
            </div>
          </motion.div>

          {/* Right: Controls */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Bet Amount */}
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

              {/* Auto Cashout */}
              <div className="mb-4">
                <label className="text-gray-400 text-sm mb-2 block">Auto Cashout (optional)</label>
                <div className="flex gap-2">
                  {[2, 3, 5, 10].map((val) => (
                    <button
                      key={val}
                      onClick={() => setAutoCashout(autoCashout === val ? null : val)}
                      className={`flex-1 py-2 rounded-xl font-bold transition-all ${autoCashout === val ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                    >
                      {val}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSpinning || balance < betAmount}
                  onClick={handleBet}
                  className="w-full py-6 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-black text-2xl tracking-wider shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-purple-500/40 transition-shadow"
                >
                  {isSpinning ? "SPINNING..." : "PLACE BET"}
                </motion.button>
                
                {isSpinning && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => handleCashout(multiplier)}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black text-xl shadow-lg shadow-green-500/25"
                  >
                    CASH OUT @ {multiplier.toFixed(2)}x
                  </motion.button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
                <Trophy className="w-5 h-5 text-green-400 mx-auto mb-1" />
                <p className="text-gray-400 text-xs mb-1">Wins</p>
                <p className="text-xl font-bold text-green-400">{stats.wins}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
                <TrendingUp className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                <p className="text-gray-400 text-xs mb-1">Biggest</p>
                <p className="text-xl font-bold text-cyan-400">${stats.biggestWin.toFixed(0)}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <p className="text-gray-400 text-xs mb-1">Games</p>
                <p className="text-xl font-bold text-purple-400">{stats.games}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm"
          >
            <p className="text-gray-400 text-sm mb-3">Recent Games</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {history.map((val, idx) => (
                <div 
                  key={idx}
                  className={`px-4 py-2 rounded-xl font-mono font-bold flex-shrink-0 ${val >= 2 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                >
                  {val.toFixed(2)}x
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
