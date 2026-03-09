import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  FileText,
  ExternalLink,
} from "lucide-react";
import {
  adminProviderService,
  AdminProviderApplicationDetailResponse,
} from "../../../services/adminProviderService";

interface ModalProps {
  companyId: number;
  onClose: () => void;
  onStatusChanged: () => void;
}

const TourCompanyDetailsModal: React.FC<ModalProps> = ({
  companyId,
  onClose,
  onStatusChanged,
}) => {
  const [data, setData] =
    useState<AdminProviderApplicationDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Action State
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetchDetail();
  }, [companyId]);

  const fetchDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result =
        await adminProviderService.getProviderApplicationDetail(companyId);
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to load application details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (
      !window.confirm(
        "Approve this company? They will be granted Tour Company permissions.",
      )
    )
      return;
    setIsProcessing(true);
    try {
      await adminProviderService.approveApplication(companyId);
      alert("Company Application Approved Successfully.");
      onStatusChanged();
    } catch (err: any) {
      alert(err.message || "Failed to approve application.");
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide a rejection reason.");
      return;
    }
    setIsProcessing(true);
    try {
      await adminProviderService.rejectApplication(companyId, rejectReason);
      alert("Company Application Rejected.");
      onStatusChanged();
    } catch (err: any) {
      alert(err.message || "Failed to reject application.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
          <h2 className="text-xl font-black text-gray-900">
            Application Review
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-3" />
              <p className="text-red-500 font-bold">{error}</p>
            </div>
          ) : data ? (
            <div className="space-y-8">
              {/* Company Info */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-4">
                    Business Information
                  </h3>
                  <div className="space-y-3 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                      <span className="text-xs text-gray-500 font-bold uppercase">
                        Company Name:
                      </span>{" "}
                      <p className="font-bold text-gray-900">
                        {data.company.name}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 font-bold uppercase">
                        Tax Code:
                      </span>{" "}
                      <p className="font-bold text-gray-900">
                        {data.company.taxCode}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 font-bold uppercase">
                        Citizen ID (Rep):
                      </span>{" "}
                      <p className="font-bold text-gray-900">
                        {data.company.citizenId}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 font-bold uppercase">
                        Address:
                      </span>{" "}
                      <p className="font-medium text-gray-700 text-sm whitespace-pre-wrap">
                        {data.company.address}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 font-bold uppercase">
                        Current Status:
                      </span>{" "}
                      <p className="font-black text-primary">
                        {data.company.status}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-3 p-5 bg-gray-50 rounded-2xl border border-gray-100 h-full">
                    <div>
                      <span className="text-xs text-gray-500 font-bold uppercase">
                        Email:
                      </span>{" "}
                      <p className="font-bold text-gray-900">
                        {data.company.contactEmail}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 font-bold uppercase">
                        Phone:
                      </span>{" "}
                      <p className="font-bold text-gray-900">
                        {data.company.contactPhone}
                      </p>
                    </div>
                    {data.company.description && (
                      <div className="mt-4 border-t border-gray-200 pt-3">
                        <span className="text-xs text-gray-500 font-bold uppercase">
                          Description:
                        </span>
                        <p className="text-sm text-gray-700 mt-1 max-h-24 overflow-y-auto">
                          {data.company.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Documents Section */}
              <section>
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-4">
                  Uploaded Documents
                </h3>
                {data.documents.length === 0 ? (
                  <div className="p-6 bg-gray-50 rounded-2xl text-center text-gray-500 font-medium">
                    No documents uploaded.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.documents.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.documentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex flex-col p-4 bg-white border border-gray-200 rounded-2xl hover:border-primary hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                            <FileText size={20} />
                          </div>
                          <ExternalLink
                            size={16}
                            className="text-gray-300 group-hover:text-primary transition-colors"
                          />
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm truncate">
                          {doc.documentType.replace(/_/g, " ")}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Uploaded:{" "}
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </a>
                    ))}
                  </div>
                )}
              </section>
            </div>
          ) : null}
        </div>

        {/* Modal Footer / Actions */}
        {data && data.company.status === "PENDING_VERIFICATION" && (
          <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/50 shrink-0">
            {rejectMode ? (
              <div className="space-y-4 animate-in slide-in-from-bottom-2 fade-in">
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2">
                    Reason for rejection <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full p-3 bg-white border border-red-200 rounded-xl outline-none focus:ring-2 focus:ring-red-200 resize-none font-medium text-gray-700"
                    rows={3}
                    placeholder="Please clearly specify what is missing or incorrect..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setRejectMode(false);
                      setRejectReason("");
                    }}
                    disabled={isProcessing}
                    className="px-6 py-2.5 rounded-xl font-bold bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={isProcessing || !rejectReason.trim()}
                    className="px-6 py-2.5 rounded-xl font-bold bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <XCircle size={18} />
                    )}
                    {isProcessing ? "Processing..." : "Confirm Rejection"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => setRejectMode(true)}
                  className="px-8 py-3 rounded-xl font-bold border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
                >
                  Reject Application
                </button>
                <button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="btn-primary px-8 py-3 rounded-xl flex justify-center items-center gap-2"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  Approve Company
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TourCompanyDetailsModal;
