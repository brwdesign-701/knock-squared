import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-8"
        >
          <div className="text-9xl font-bold text-[#39C0C3] mb-4">404</div>
          <Search className="mx-auto text-gray-400" size={64} />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Technician Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the technician profile you're looking for. It may have been removed or the link might be incorrect.
        </p>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 bg-[#39C0C3] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#2da5a8] transition-all transform hover:scale-105"
        >
          <Home size={20} />
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
