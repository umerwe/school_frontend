import { motion } from 'framer-motion';
// Hello
const SchoolLoader = () => {
  const containerVariants = {
    start: { transition: { staggerChildren: 0.2 } },
    end: { transition: { staggerChildren: 0.2 } },
  };

  const circleVariants = {
    start: { y: "0%" },
    end: { y: "100%" },
  };

  const circleTransition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* Bouncing Dots */}
      <motion.div
        className="flex space-x-2 mb-4"
        variants={containerVariants}
        initial="start"
        animate="end"
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-3 h-3 bg-indigo-500 rounded-full"
            variants={circleVariants}
            transition={circleTransition}
          />
        ))}
      </motion.div>

      {/* Loading Text */}
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-sm text-gray-500 mt-2"
      >
        Loading ...
      </motion.p>
    </div>
  );
};

export default SchoolLoader;
