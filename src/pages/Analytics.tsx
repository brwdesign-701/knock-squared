import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, Share2, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalyticsData {
  totalTechnicians: number;
  totalProfileViews: number;
  totalShareLinks: number;
  mostViewedTechnician: { name: string; views: number } | null;
}

interface ViewsOverTime {
  date: string;
  views: number;
}

interface TechnicianViewData {
  name: string;
  views: number;
}

export default function Analytics() {
  const { company } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalTechnicians: 0,
    totalProfileViews: 0,
    totalShareLinks: 0,
    mostViewedTechnician: null,
  });
  const [viewsOverTime, setViewsOverTime] = useState<ViewsOverTime[]>([]);
  const [technicianViews, setTechnicianViews] = useState<TechnicianViewData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (company) {
      fetchAnalytics();
    }
  }, [company]);

  const fetchAnalytics = async () => {
    if (!company) return;

    try {
      const { data: techData } = await supabase
        .from('technicians')
        .select('id, first_name, last_name')
        .eq('company_id', company.id);

      const totalTechnicians = techData?.length || 0;

      const { count: profileViewsCount } = await supabase
        .from('profile_views')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', company.id);

      const { count: shareLinksCount } = await supabase
        .from('share_events')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', company.id);

      const { data: viewsData } = await supabase
        .from('profile_views')
        .select('technician_id, technicians(first_name, last_name)')
        .eq('company_id', company.id)
        .order('viewed_at', { ascending: false });

      const viewsByTechnician: { [key: string]: { name: string; views: number } } = {};
      if (viewsData) {
        viewsData.forEach((view: any) => {
          const techId = view.technician_id;
          const techName = view.technicians
            ? `${view.technicians.first_name} ${view.technicians.last_name}`
            : 'Unknown';

          if (!viewsByTechnician[techId]) {
            viewsByTechnician[techId] = { name: techName, views: 0 };
          }
          viewsByTechnician[techId].views += 1;
        });
      }

      const techViewArray = Object.values(viewsByTechnician).sort(
        (a, b) => b.views - a.views
      );

      const mostViewed = techViewArray.length > 0 ? techViewArray[0] : null;

      const { data: rawViewsData } = await supabase
        .from('profile_views')
        .select('viewed_at')
        .eq('company_id', company.id)
        .order('viewed_at', { ascending: true });

      const viewsByDate: { [key: string]: number } = {};
      if (rawViewsData) {
        rawViewsData.forEach((view: any) => {
          const date = new Date(view.viewed_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
          viewsByDate[date] = (viewsByDate[date] || 0) + 1;
        });
      }

      const timeSeriesData = Object.entries(viewsByDate)
        .map(([date, views]) => ({ date, views }))
        .slice(-14);

      setAnalytics({
        totalTechnicians,
        totalProfileViews: profileViewsCount || 0,
        totalShareLinks: shareLinksCount || 0,
        mostViewedTechnician: mostViewed,
      });

      setTechnicianViews(techViewArray.slice(0, 5));
      setViewsOverTime(timeSeriesData);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
  }: {
    icon: any;
    label: string;
    value: number | string;
    color: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border-l-4"
      style={{ borderColor: color }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}20` }}>
          <Icon size={28} style={{ color }} />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600 text-lg font-medium">Loading analytics...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex flex-col">
      <Navbar />
      <div className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600 text-lg">Track your technician profiles and customer engagement</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Users}
              label="Total Technicians"
              value={analytics.totalTechnicians}
              color="#0B2E51"
            />
            <StatCard
              icon={Eye}
              label="Profile Views"
              value={analytics.totalProfileViews}
              color="#39C0C3"
            />
            <StatCard
              icon={Share2}
              label="Share Links Sent"
              value={analytics.totalShareLinks}
              color="#67C3E5"
            />
            <StatCard
              icon={TrendingUp}
              label="Most Viewed"
              value={analytics.mostViewedTechnician?.name || 'N/A'}
              color="#E0505F"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Views - Last 14 Days</h2>
              {viewsOverTime.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={viewsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="views"
                      stroke="#39C0C3"
                      strokeWidth={3}
                      dot={{ fill: '#39C0C3', r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  No view data yet
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Most Viewed Technicians</h2>
              {technicianViews.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={technicianViews} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" stroke="#9ca3af" />
                    <YAxis dataKey="name" type="category" width={100} stroke="#9ca3af" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="views" fill="#39C0C3" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  No technician views yet
                </div>
              )}
            </motion.div>
          </div>

          {analytics.mostViewedTechnician && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-[#0B2E51] to-[#39C0C3] rounded-2xl p-8 text-white shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white text-opacity-90 mb-2">Star Performer</h3>
                  <p className="text-4xl font-bold">{analytics.mostViewedTechnician.name}</p>
                  <p className="text-white text-opacity-80 mt-2">
                    {analytics.mostViewedTechnician.views} profile views
                  </p>
                </div>
                <div className="text-6xl font-bold text-white text-opacity-20">⭐</div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
