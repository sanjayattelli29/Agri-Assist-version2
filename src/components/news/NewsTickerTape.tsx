
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface NewsTickerTapeProps {
  headlines: string[];
}

export const NewsTickerTape = ({ headlines }: NewsTickerTapeProps) => {
  const [duplicatedHeadlines, setDuplicatedHeadlines] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Duplicate headlines to create a seamless loop
  useEffect(() => {
    if (headlines.length > 0) {
      // Duplicate more times for a longer loop
      setDuplicatedHeadlines([...headlines, ...headlines, ...headlines]);
    }
  }, [headlines]);
  
  if (headlines.length === 0) return null;
  
  return (
    <div className="w-full bg-green-800/90 dark:bg-green-900 text-white py-2 mb-6 overflow-hidden">
      <div className="flex items-center">
        <div className="flex-shrink-0 px-4 font-bold bg-green-700 dark:bg-green-800 py-1 rounded-r-full">
          LATEST
        </div>
        <div ref={containerRef} className="overflow-hidden flex-1 ml-4 whitespace-nowrap">
          <motion.div
            initial={{ x: containerRef.current ? containerRef.current.offsetWidth : 0 }}
            animate={{ x: "-100%" }}
            transition={{ 
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
              duration: duplicatedHeadlines.length * 8,
              repeatDelay: 0
            }}
            className="inline-block whitespace-nowrap"
          >
            {duplicatedHeadlines.map((headline, idx) => (
              <span key={idx} className="inline-block mx-8">
                • {headline}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
