import { motion } from 'framer-motion';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <motion.p
      className="text-red-500 text-xs"
      initial={{ opacity: 0, y: 20 }}  // Start off-screen and invisible
      animate={{ opacity: 1, y: 0 }}   // Fade in and slide into place
      exit={{ opacity: 0, y: 20 }}     // Fade out and slide out when removed
      transition={{
        type: 'spring',
        stiffness: 300,   // Controls how "bouncy" the animation is
        damping: 20,      // Controls how smooth the bounce is
        duration: 1       // Slow down the duration for a more visible bounce
      }}
    >
      {message}
    </motion.p>
  );
};

export default ErrorMessage;
