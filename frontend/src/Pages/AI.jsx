import Assistant from '../Components/AI/Assistant';
import { motion } from 'framer-motion';

export default function AI() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-4 md:px-8 lg:px-16 py-6">
      <Assistant />
    </motion.div>
  );
}
