"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, Home, Users, Football } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              FLUXDRAW
            </h1>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl transition-colors ${
                pathname === "/" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden md:inline">Casino</span>
            </Link>
            <Link
              href="/sports"
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl transition-colors ${
                pathname === "/sports" ? "bg-green-500/20 text-green-400" : "text-gray-400 hover:text-green-400 hover:bg-white/5"
              }`}
            >
              <Football className="w-4 h-4" />
              <span className="hidden md:inline">Sports</span>
            </Link>
            <Link
              href="/waitlist"
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl transition-colors ${
                pathname === "/waitlist" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="hidden md:inline">Waitlist</span>
            </Link>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
