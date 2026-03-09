import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Search,
  Filter,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  adminProviderService,
  TourCompanyResponse,
  PageResponse,
} from "../../services/adminProviderService";
import TourCompanyDetailsModal from "./components/TourCompanyDetailsModal";

const TourCompanyManagementPage: React.FC = () => {
  const [companiesData, setCompaniesData] =
    useState<PageResponse<TourCompanyResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(0);

  // Modal State
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    fetchCompanies();
  }, [page, statusFilter]);

  const fetchCompanies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminProviderService.getProviderApplications(
        page,
        10,
        statusFilter,
      );
      setCompaniesData(data);
    } catch (err: any) {
      setError(err.message || "Failed to load tour companies.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_VERIFICATION":
        return (
          <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-xs font-black tracking-widest flex items-center gap-1 w-fit">
            <AlertCircle size={12} /> PENDING
          </span>
        );
      case "ACTIVE":
      case "APPROVED":
        return (
          <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-black tracking-widest flex items-center gap-1 w-fit">
            <CheckCircle size={12} /> ACTIVE
          </span>
        );
      case "REJECTED":
      case "SUSPENDED":
        return (
          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-black tracking-widest flex items-center gap-1 w-fit">
            <XCircle size={12} /> {status}
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-black tracking-widest w-fit">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Tour Companies</h1>
          <p className="text-gray-500 font-medium mt-1">
            Manage partner registrations and verification statuses.
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-xl shadow-black/5 border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search companies by name..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="text-gray-400 w-5 h-5 hidden sm:block" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            className="w-full sm:w-auto pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-bold text-gray-700 text-sm cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING_VERIFICATION">Pending Review</option>
            <option value="ACTIVE">Active</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-gray-500 font-bold">Loading companies data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 px-6">
            <AlertCircle size={48} className="mx-auto text-red-300 mb-4" />
            <h3 className="text-lg font-bold text-red-400 mb-4">{error}</h3>
            <button
              onClick={fetchCompanies}
              className="btn-primary px-8 py-2.5"
            >
              Retry
            </button>
          </div>
        ) : companiesData?.content.length === 0 ? (
          <div className="text-center py-20">
            <Building2 size={48} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-lg font-bold text-gray-400">
              No companies found.
            </h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-black text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Company Details</th>
                  <th className="px-6 py-4">Contact File</th>
                  <th className="px-6 py-4">Registration Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {companiesData?.content.map((company) => (
                  <tr
                    key={company.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                          {company.logoUrl ? (
                            <img
                              src={company.logoUrl}
                              alt={company.name}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          ) : (
                            <Building2 size={20} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">
                            {company.name}
                          </p>
                          <p className="text-xs text-gray-500 font-medium">
                            Tax: {company.taxCode}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-700">
                        {company.contactEmail}
                      </p>
                      <p className="text-xs text-gray-500">
                        {company.contactPhone}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">
                      {new Date(company.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(company.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedCompanyId(company.id)}
                        className="text-primary hover:text-primary-dark font-black text-sm bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors inline-block"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {companiesData && companiesData.totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm font-medium text-gray-500 bg-gray-50/30">
            <p>
              Showing page {companiesData.pageNumber + 1} of{" "}
              {companiesData.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={companiesData.pageNumber === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <button
                disabled={companiesData.isLast}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedCompanyId && (
        <TourCompanyDetailsModal
          companyId={selectedCompanyId}
          onClose={() => setSelectedCompanyId(null)}
          onStatusChanged={() => {
            setSelectedCompanyId(null);
            fetchCompanies();
          }}
        />
      )}
    </div>
  );
};

export default TourCompanyManagementPage;
