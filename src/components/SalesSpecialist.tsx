import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const SalesSpecialist = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Show automatically on homepage after a short delay
    const isHome = window.location.pathname === '/';
    if (isHome) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setTimeout(() => setShowBubble(true), 1000);
      }, 2000);
      return () => clearTimeout(timer);
    }

    // Listen for activation from Support Bot
    const handleActivate = () => {
      setIsVisible(true);
      setShowBubble(true);
      // Scroll to top to ensure he's seen
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('activateBiralBot', handleActivate);
    return () => window.removeEventListener('activateBiralBot', handleActivate);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/axtaris?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none">
          <motion.div
            initial={{ y: -200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -200, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 100 }}
            className="relative flex flex-col items-center pointer-events-auto"
          >
            {/* The Character */}
            <div className="relative w-40 h-40 md:w-48 md:h-48 group">
              <motion.img
                src="/biralbot-sales.png"
                alt="Sales Specialist"
                className="w-full h-full object-contain cursor-pointer"
                animate={{ 
                  rotate: [0, -2, 2, -2, 0],
                  y: [0, -5, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
                onClick={() => setShowBubble(!showBubble)}
              />
              
              {/* Close Button */}
              <button 
                onClick={() => setIsVisible(false)}
                className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full p-1 border border-border hover:bg-muted transition-colors shadow-sm"
              >
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>

            {/* Welcome Bubble */}
            <AnimatePresence>
              {showBubble && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 10 }}
                  className="absolute top-36 md:top-40 bg-white border-2 border-primary rounded-2xl p-4 shadow-xl max-w-[280px] text-center"
                >
                  <p className="text-sm font-bold text-foreground mb-3">
                    Nə axtardığını təsvir et, mən tapım :)
                  </p>
                  
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Məsələn: Mətbəx bıçağı..."
                        className="pl-8 h-9 text-xs border-primary/20 focus-visible:ring-primary"
                        autoFocus
                      />
                    </div>
                    <Button type="submit" size="sm" className="h-9 px-3">
                      Tap
                    </Button>
                  </form>

                  {/* Bubble Tail */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-l-8 border-l-transparent border-r-8 border-r-transparent border-bottom-8 border-b-white" />
                  <div className="absolute -top-[10px] left-1/2 -translate-x-1/2 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-bottom-[10px] border-b-primary -z-10" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SalesSpecialist;
