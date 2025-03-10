import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  valid: boolean
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, valid }) => {
  return (
    <motion.div
      key={valid ? "valid" : "invalid"}
      className="flex items-center gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 1
      }}
    >
      {valid ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <XCircle className="w-4 h-4 text-red-500" />
      )}
      <p className={`text-xs ${valid ? "text-green-500" : "text-red-500"}`}>
        {message}
      </p>
    </motion.div>


  );
};

export default ErrorMessage;
