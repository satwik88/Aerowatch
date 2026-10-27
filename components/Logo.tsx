"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Radar } from "lucide-react";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      <Link
        href="/"
        aria-label="AeroWatch home"
        className="group inline-flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/70 backdrop-blur-md border border-cream/80 shadow-sm hover:bg-white/90 hover:border-cream hover:shadow-md transition-all duration-200"
      >
        <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-lapis-dark text-cream shadow-sm group-hover:bg-plum transition-colors duration-200">
          <Radar className="w-4 h-4 text-cream" />
        </div>
        <span className="text-xl font-bold tracking-tight text-lapis-dark select-none">
          Aero<span className="text-plum">Watch</span>
        </span>
      </Link>
    </motion.div>
  );
}
