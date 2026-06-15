"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Clock, TrendingUp, Football } from "lucide-react";
import Link from "next/link";

// Mock football matches data
const matches = [
  {
    id: 1,
    league: "Premier League",
    homeTeam: "Manchester City",
    awayTeam: "Arsenal",
    time: "Today 15:00",
    odds: {
      home: 1.85,
      draw: 3.60,
      away: 4.20,
      over25: 1.72,
      under25: 2.10,
      bttsYes: 1.65,
      bttsNo: 2.20
    }
  },
  {
    id: 2,
    league: "La Liga",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    time: "Today 20:00",
    odds: {
      home: 2.10,
      draw: 3.40,
      away: 3.50,
      over25: 1.80,
      under25: 2.00,
      bttsYes: 1.70,
      bttsNo: 2.15
    }
  },
  {
    id: 3,
    league: "Champions League",
    homeTeam: "Bayern Munich",
    awayTeam: "PSG",
    time: "Tomorrow 20:00",
    odds: {
      home: 1.95,
      draw: 3.50,
      away: 3.90,
      over25: 1.68,
      under25: 2.20,
      bttsYes: 1.60,
      bttsNo: 2.30
    }
  },
  {
    id: 4,
    league: "Serie A",
    homeTeam: "Juventus",
    awayTeam: "AC Milan",
    time: "Tomorrow 18:00",
    odds: {
      home: 2.20,
      draw: 3.30,
      away: 3.40,
      over25: 1.85,
      under25: 1.95,
      bttsYes: 1.75,
      bttsNo: 2.05
    }
  },
  {
    id: 5,
    league: "Bundesliga",
    homeTeam: "Dortmund",
    awayTeam: "RB Leipzig",
    time: "Sat 15:30",
    odds: {
      home: 2.05,
      draw: 3.45,
      away: 3.60,
      over25: 1.75,
      under25: 2.05,
      bttsYes: 1.68,
      bttsNo: 2.18
    }
  }
];

interface Bet {
  matchId: number;
  selection: string;
  odds: number;
  match: string;
}

export default function SportsPage() {
  const [selectedBets, setSelectedBets] = useState<Bet[]>([]);
  const [betAmount, setBetAmount] = useState(10);

  const addBet = (match: typeof matches[0], selection: string, odds: number) => {
    const newBet: Bet = {
      matchId: match.id,
      selection,
      odds,
      match: `${match.homeTeam} vs ${match.awayTeam}`
    };
    
    // Remove existing bet for this match if exists
    const filtered = selectedBets.filter(b => b.matchId !== match.id);
    setSelectedBets([...filtered, newBet]);
  };

  const removeBet = (matchId: number) => {
    setSelectedBets(selectedBets.filter(b => b.matchId !== matchId));
  };

  const totalOdds = selectedBets.reduce((acc, bet) => acc * bet.odds, 1);
  const potentialWin = betAmount * totalOdds;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-4 md:p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Football className="w-8 h-8 text-green-400" />
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
              SPORTS BETTING
            </h1>
          </div>
          <p className="text-gray-400">Live odds on top football matches</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Matches List */}
          <div className="lg:col-span-2 space-y-4">
            {matches.map((match, idx) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
              >
                {/* League & Time */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-400">{match.league}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    {match.time}
                  </div>
                </div>

                {/* Teams */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold">{match.homeTeam}</span>
                  <span className="text-gray-500">VS</span>
                  <span className="text-lg font-bold">{match.awayTeam}</span>
                </div>

                {/* Betting Options */}
                <div className="space-y-3">
                  {/* 1X2 */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => addBet(match, `${match.homeTeam} Win`, match.odds.home)}
                      className={`py-3 rounded-xl font-bold transition-all ${
                        selectedBets.find(b => b.matchId === match.id && b.selection.includes('Win') && b.selection.includes(match.homeTeam))
                          ? 'bg-green-600 text-white' 
                          : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      1 <span className="text-sm opacity-75">({match.odds.home.toFixed(2)})</span>
                    </button>
                    <button
                      onClick={() => addBet(match, 'Draw', match.odds.draw)}
                      className={`py-3 rounded-xl font-bold transition-all ${
                        selectedBets.find(b => b.matchId === match.id && b.selection === 'Draw')
                          ? 'bg-green-600 text-white' 
                          : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      X <span className="text-sm opacity-75">({match.odds.draw.toFixed(2)})</span>
                    </button>
                    <button
                      onClick={() => addBet(match, `${match.awayTeam} Win`, match.odds.away)}
                      className={`py-3 rounded-xl font-bold transition-all ${
                        selectedBets.find(b => b.matchId === match.id && b.selection.includes('Win') && b.selection.includes(match.awayTeam))
                          ? 'bg-green-600 text-white' 
                          : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      2 <span className="text-sm opacity-75">({match.odds.away.toFixed(2)})</span>
                    </button>
                  </div>

                  {/* Over/Under */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => addBet(match, 'Over 2.5', match.odds.over25)}
                      className={`py-2 rounded-xl font-bold text-sm transition-all ${
                        selectedBets.find(b => b.matchId === match.id && b.selection === 'Over 2.5')
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      Over 2.5 ({match.odds.over25.toFixed(2)})
                    </button>
                    <button
                      onClick={() => addBet(match, 'Under 2.5', match.odds.under25)}
                      className={`py-2 rounded-xl font-bold text-sm transition-all ${
                        selectedBets.find(b => b.matchId === match.id && b.selection === 'Under 2.5')
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      Under 2.5 ({match.odds.under25.toFixed(2)})
                    </button>
                  </div>

                  {/* BTTS */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => addBet(match, 'BTTS Yes', match.odds.bttsYes)}
                      className={`py-2 rounded-xl font-bold text-sm transition-all ${
                        selectedBets.find(b => b.matchId === match.id && b.selection === 'BTTS Yes')
                          ? 'bg-purple-600 text-white' 
                          : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      BTTS Yes ({match.odds.bttsYes.toFixed(2)})
                    </button>
                    <button
                      onClick={() => addBet(match, 'BTTS No', match.odds.bttsNo)}
                      className={`py-2 rounded-xl font-bold text-sm transition-all ${
                        selectedBets.find(b => b.matchId === match.id && b.selection === 'BTTS No')
                          ? 'bg-purple-600 text-white' 
                          : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      BTTS No ({match.odds.bttsNo.toFixed(2)})
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bet Slip */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-gradient-to-b from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Bet Slip
                </h2>
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-bold">
                  {selectedBets.length}
                </span>
              </div>

              {selectedBets.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  Click odds to add selections
                </p>
              ) : (
                <div className="space-y-4">
                  {/* Selected Bets */}
                  <div className="space-y-2">
                    {selectedBets.map((bet) => (
                      <div key={bet.matchId} className="bg-white/5 rounded-xl p-3 border border-white/10">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-sm text-green-400">{bet.selection}</p>
                            <p className="text-xs text-gray-400">{bet.match}</p>
                            <p className="text-lg font-bold mt-1">{bet.odds.toFixed(2)}</p>
                          </div>
                          <button
                            onClick={() => removeBet(bet.matchId)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total Odds */}
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Total Odds</span>
                      <span className="text-2xl font-bold text-green-400">{totalOdds.toFixed(2)}</span>
                    </div>
                    
                    {/* Bet Amount */}
                    <div className="mb-4">
                      <label className="text-sm text-gray-400 mb-2 block">Stake</label>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">$</span>
                        <input
                          type="number"
                          value={betAmount}
                          onChange={(e) => setBetAmount(Number(e.target.value))}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-green-500"
                        />
                      </div>
                    </div>

                    {/* Potential Win */}
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Potential Win</span>
                        <span className="text-2xl font-bold text-green-400">${potentialWin.toFixed(2)}</span>
                      </div>
                    </div>

                    <button className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-green-500/25 transition-shadow">
                      PLACE BET
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
