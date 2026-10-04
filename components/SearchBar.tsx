"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { searchLocation } from "@/lib/geocode";
import { PlaceResult } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  onSelect: (place: PlaceResult) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ onSelect, placeholder = "Search a city...", className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    if (!query) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      const data = await searchLocation(query);
      setResults(data);
      setIsLoading(false);
      setIsOpen(true);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className={`relative w-full max-w-md ${className}`}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="w-5 h-5 text-lapis-mid/50 group-focus-within:text-lapis-mid transition-colors" />
        </div>
        <input
          type="text"
          className="w-full bg-white border border-cream text-lapis-dark font-medium text-lg rounded-2xl focus:ring-2 focus:ring-plum/40 focus:border-transparent block pl-12 pr-12 py-4 shadow-sm transition-all placeholder:text-lapis-mid/50 outline-none"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
        />
        {query && (
          <button 
            onClick={() => { setQuery(""); setResults([]); }}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-lapis-mid/50 hover:text-lapis-mid transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (results.length > 0 || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white border border-cream rounded-2xl shadow-lg overflow-hidden"
          >
            {isLoading ? (
              <div className="p-6 flex items-center justify-center text-lapis-mid/70 font-medium">
                <Loader2 className="w-6 h-6 animate-spin mr-2 text-lapis-mid/50" />
                Searching...
              </div>
            ) : (
              <ul>
                {results.map((place) => (
                  <li key={place.place_id}>
                    <button
                      className="w-full text-left px-5 py-4 hover:bg-cream/20 transition-colors flex items-start gap-3 border-b border-cream/50 last:border-0"
                      onClick={() => {
                        onSelect(place);
                        setIsOpen(false);
                        setQuery("");
                      }}
                    >
                      <MapPin className="w-5 h-5 text-plum mt-0.5 shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-lapis-dark font-bold">{place.name}</span>
                        <span className="text-sm font-medium text-lapis-mid/70 truncate max-w-xs">
                          {place.display_name.split(', ').slice(1).join(', ')}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
