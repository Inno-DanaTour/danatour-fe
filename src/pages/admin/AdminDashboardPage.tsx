import React from "react";
import {
  Users,
  Building2,
  TrendingUp,
  AlertCircle,
  CalendarClock,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AdminDashboardPage: React.FC = () => {
  // Mock Data
  const stats = [
    {
      title: "Total Users",
      value: "1,245",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-100",
    },
    {
      title: "Tour Companies",
      value: "48",
      icon: Building2,
      color: "text-purple-500",
      bg: "bg-purple-100",
    },
    {
      title: "Pending Approvals",
      value: "12",
      icon: AlertCircle,
      color: "text-amber-500",
      bg: "bg-amber-100",
    },
    {
      title: "Total Bookings",
      value: "3,892",
      icon: CalendarClock,
      color: "text-emerald-500",
      bg: "bg-emerald-100",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header>
        <h1 className="text-3xl font-black text-gray-900">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          Welcome back, Admin. Here's what's happening today.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-black/5 flex items-center gap-4"
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} shrink-0`}
            >
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400">{stat.title}</p>
              <h3 className="text-2xl font-black text-gray-900 leading-tight">
                {stat.value}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Action & Recent Activity Mock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approvals Callout */}
        <div className="lg:col-span-2 bg-gradient-to-br from-primary to-blue-600 rounded-[2rem] p-8 text-white shadow-xl shadow-primary/20 flex flex-col justify-center">
          <h2 className="text-2xl font-black mb-2">
            12 Provider Applications Require Review
          </h2>
          <p className="text-blue-100 mb-6 max-w-md font-medium">
            New tour companies have registered and uploaded their business
            documents. Please review them to maintain platform quality and legal
            compliance.
          </p>
          <div>
            <Link
              to="/admin/companies"
              className="bg-white text-primary px-8 py-3 rounded-xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all inline-block"
            >
              Review Applications
            </Link>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-xl shadow-black/5 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Revenue Metrics</h3>
            <TrendingUp size={20} className="text-gray-400" />
          </div>
          <div className="flex-1 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
            <div className="text-center">
              <TrendingUp size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-bold text-gray-400">
                Chart rendering here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
