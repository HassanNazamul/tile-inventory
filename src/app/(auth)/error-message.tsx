import { motion } from 'framer-motion';

interface ErrorMessageProps {
  message: string;
  valid: boolean
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, valid }) => {
  return (
    <motion.p
      key={valid ? 'valid' : 'invalid'}
      className={`text-xs ${valid ? "text-green-500" : "text-red-500"}`}
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
