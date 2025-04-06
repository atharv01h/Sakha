import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function TypingIndicator() {
  const [loadingText, setLoadingText] = useState('Channeling divine wisdom');
  
  const texts = [
  'Tuning into divine 5G 📡🕉️',
  'Thoda patience yaar… Krishna is typing 😌',
  'Accessing Gita’s ancient servers 🧘‍♂️💻',
  'Dil se puchh raha hoon… literally ❤️🙏',
  'Getting spiritual GPS location for your answer 📍🌌',
  'Mind, soul aur Wi-Fi align kar raha hoon 🔄😇',
  'Krishna se DM mein baat ho rahi hai 😅📲',
  'Spiritual loading... please wait ⏳✨',
  'Gita ke shlokon mein solution dhoond raha hoon 📖🔍',
  'Universe ko ping bhej diya hai, abhi aata hai reply 🚀🪐'
];

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % texts.length;
      setLoadingText(texts[currentIndex]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const dotVariants = {
    initial: { y: 0 },
    animate: { y: [-2, 2, -2] }
  };

  const containerVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2
      }
    }
  };

  const shimmerVariants = {
    initial: { x: '-100%' },
    animate: { 
      x: '100%',
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'linear'
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col items-start space-y-2"
    >
      <div className="bg-purple-100 dark:bg-purple-900/20 rounded-2xl rounded-tl-none px-4 py-3 relative overflow-hidden">
        <motion.div
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
        
        <div className="flex items-center gap-2">
          <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
            {loadingText}
          </p>
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                variants={dotVariants}
                animate="animate"
                transition={{
                  repeat: Infinity,
                  duration: 0.8,
                  delay: i * 0.2,
                  ease: 'easeInOut'
                }}
                className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400"
              />
            ))}
          </div>
        </div>

        <div className="mt-1 flex items-center gap-1.5">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-1 h-1 rounded-full bg-purple-300 dark:bg-purple-600"
            />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1 }}
        className="text-xs text-gray-500 dark:text-gray-400 ml-2"
      >
        🕉️ Om Namah Shivaya
      </motion.div>
    </motion.div>
  );
}
