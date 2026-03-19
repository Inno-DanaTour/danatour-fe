import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Calendar, TrendingUp, ChevronRight } from "lucide-react";
import Header from "../../../components/layout/Header";

const ManagementHub: React.FC = () => {
  const navigate = useNavigate();

  const managementOptions = [
    {
      title: "Tour Management",
      description: "Create, edit, and organize your tour listings",
      icon: Package,
      href: "/tours/manage",
      color: "from-blue-500 to-indigo-600",
      stats: "Activate & monitor tours",
    },
    {
      title: "Booking Management",
      description: "Track and manage customer bookings and schedules",
      icon: Calendar,
      href: "/tours/bookings",
      color: "from-emerald-500 to-teal-600",
      stats: "Review all reservations",
    },
    {
      title: "Promotions",
      description: "Manage discounts and special offers for your tours",
      icon: TrendingUp,
      href: "/tours/promotions",
      color: "from-rose-500 to-pink-600",
      stats: "Boost your tour sales",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header onBookClick={() => navigate("/tours")} />

      <main className="pt-24 md:pt-32 px-4 md:px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
            Partner <span className="text-primary">Management</span>
          </h1>
          <p className="text-gray-500 text-lg font-medium max-w-2xl">
            Welcome back! Select a section below to manage your tour operations
            and track your business growth.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {managementOptions.map((option, index) => (
            <motion.div
              key={option.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(option.href)}
              className="group relative cursor-pointer"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-5 rounded-[2.5rem] transition-opacity duration-300`}
              />
              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 h-full shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
                <div
                  className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${option.color} opacity-5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}
                />

                <div>
                  <div
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${option.color} text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <option.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-black mb-3">{option.title}</h3>
                  <p className="text-gray-500 font-medium leading-relaxed mb-6">
                    {option.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-primary transition-colors">
                    {option.stats}
                  </span>
                  <div className="bg-gray-50 p-2 rounded-full group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Tips or Announcements could go here */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 p-8 bg-black rounded-[2.5rem] text-white overflow-hidden relative"
        >
          <div className="absolute right-0 top-0 w-1/3 h-full bg-primary/20 blur-[100px]" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h4 className="text-xl font-black mb-2">Grow Your Business</h4>
              <p className="text-gray-400 font-medium leading-relaxed">
                Need help optimizing your tour listings or understanding your
                analytics? Check out our partner documentation for best
                practices and growth tips.
              </p>
            </div>
            <button className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-primary hover:text-white transition-all shrink-0">
              View Guide
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ManagementHub;
