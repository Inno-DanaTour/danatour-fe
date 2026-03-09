import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit3,
  Eye,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Users,
  TrendingUp,
  Package,
  Loader2,
  MapPin,
} from "lucide-react";
import Header from "../../components/layout/Header";
import { tourService } from "../../services/tourService";
import { TourListItem } from "../../types/types";
import { getUserIdFromToken } from "../../configs/api";

import { companyService } from "../../services/companyService";

const ManageTours: React.FC = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState<TourListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const checkAuthAndFetchTours = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        setLoading(true);
        // Get provider info to know the companyId
        const providerInfo = await companyService.getMyProviderInfo();
        if (providerInfo && providerInfo.companyId) {
          await fetchMyTours(providerInfo.companyId);
        } else {
          setError("You are not associated with any tour company");
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Error fetching provider info:", err);
        setError(
          err.message ||
            "Failed to load provider information. Please log out and login again.",
        );
        setLoading(false);
      }
    };

    checkAuthAndFetchTours();
  }, []);

  const fetchMyTours = async (companyId: number) => {
    try {
      setLoading(true);
      const response = await tourService.getTours(1, 50, companyId);
      setTours(response?.content || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch your tours");
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header onBookClick={() => navigate("/tours")} />

      <main className="pt-24 md:pt-32 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
              My <span className="text-primary">Tours</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              Manage and monitor your travel offerings
            </p>
          </div>
          <button
            onClick={() => navigate("/tours/create")}
            className="btn-primary py-4 px-8 shadow-xl shadow-primary/20 flex items-center gap-2 group"
          >
            <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform">
              <Plus size={20} />
            </div>
            Create New Tour
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            {
              label: "Total Tours",
              value: tours?.length || 0,
              icon: Package,
              color: "bg-primary",
            },
            {
              label: "Active Bookings",
              value: "124",
              icon: TrendingUp,
              color: "bg-cta",
            },
            {
              label: "Total Revenue",
              value: "45.2M",
              icon: Calendar,
              color: "bg-black",
            },
            {
              label: "Avg. Rating",
              value: "4.8",
              icon: Users,
              color: "bg-blue-500",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4"
            >
              <div
                className={`${stat.color} text-white p-4 rounded-2xl shadow-lg`}
              >
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-black">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, location or category..."
              className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-primary/20 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold"
              >
                Clear
              </button>
            )}
          </div>
          <button className="flex items-center gap-2 px-6 py-4 bg-gray-50 rounded-2xl font-black text-sm uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition-colors shrink-0">
            <Filter size={18} /> Filter
          </button>
        </div>

        {/* Tour List Table/Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
              Syncing your data...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-10 rounded-[2.5rem] text-center border border-red-100">
            <p className="text-xl font-bold mb-4">{error}</p>
            <button
              onClick={fetchMyTours}
              className="btn-primary py-3 px-8 mx-auto"
            >
              Try Again
            </button>
          </div>
        ) : tours.length === 0 ? (
          <div className="bg-gray-50 p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
              <Package size={40} />
            </div>
            <h3 className="text-2xl font-black mb-2">No Tours Yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start listing your amazing tours and reach thousands of travelers
              looking for their next adventure.
            </p>
            <button
              onClick={() => navigate("/tours/create")}
              className="btn-primary py-4 px-10"
            >
              Create Your First Tour
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Tour Information
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Price
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Location
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Status
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tours
                    .filter(
                      (tour) =>
                        tour.title
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        tour.placeName
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()),
                    )
                    .map((tour) => (
                      <tr
                        key={tour.id}
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm">
                              <img
                                src={tour.thumbnailUrl}
                                alt={tour.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-black text-lg group-hover:text-primary transition-colors">
                                {tour.title}
                              </p>
                              <p className="text-sm text-gray-400 font-medium">
                                ID: #{tour.id} • {tour.durationDays}D
                                {tour.durationNights}N
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <p className="font-black text-cta text-lg">
                            {tour.adultPrice.toLocaleString()} VND
                          </p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-gray-500 font-bold">
                            <MapPin size={16} className="text-primary" />
                            {tour.placeName}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span
                            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              tour.status === "LOCKED"
                                ? "bg-red-100 text-red-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {tour.status || "ACTIVE"}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/tours/${tour.id}`)}
                              className="p-3 bg-gray-100 hover:bg-black hover:text-white rounded-xl transition-all"
                              title="View Public Page"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => navigate(`/tours/${tour.id}/edit`)}
                              className="p-3 bg-gray-100 hover:bg-primary hover:text-white rounded-xl transition-all shadow-sm"
                              title="Edit Tour"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
                              <MoreVertical size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageTours;
