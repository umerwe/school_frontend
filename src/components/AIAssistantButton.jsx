import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaRobot } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


export default function AIAssistantButton() {
  const navigate = useNavigate();
  const { role } = useSelector(store => store.userSlice.user)
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      <div className="relative group">
        {/* Chat bubble - appears on hover */}
        <motion.div
          className="absolute bottom-full right-full mb-3 mr-3 px-3 py-2 bg-white text-gray-800 text-sm rounded-lg shadow-lg hidden group-hover:block"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          Need help? Ask me anything!
          <div className="absolute -bottom-1 right-3 w-3 h-3 bg-white transform rotate-45"></div>
        </motion.div>

        {/* Main button */}
        <motion.button
          onClick={() => navigate(`/${role}-dashboard/ai-assistant`)}
          className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-xl"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            y: {
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            }
          }}
        >
          <FaRobot className="text-3xl" />
          <motion.span
            className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 bg-red-500 text-xs font-bold rounded-full"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          >
            AI
          </motion.span>
        </motion.button>
      </div>
    </motion.div>
  );
};