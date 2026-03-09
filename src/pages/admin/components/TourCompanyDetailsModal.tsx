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

  // Preview State
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "info" | "success" | "danger";
    onConfirm?: () => void;
    showConfirmButton?: boolean;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const showMessage = (
    title: string,
    message: string,
    type: "info" | "success" | "danger" = "info",
    onConfirm?: () => void,
    showConfirmButton: boolean = true,
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm,
      showConfirmButton,
    });
  };

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
    showMessage(
      "Confirm Approval",
      "Approve this company? They will be granted Tour Company permissions.",
      "info",
      async () => {
        setIsProcessing(true);
        try {
          await adminProviderService.approveApplication(companyId);
          showMessage(
            "Success",
            "Company Application Approved Successfully.",
            "success",
            () => {
              onStatusChanged();
            },
            false,
          );
        } catch (err: any) {
          showMessage(
            "Error",
            err.message || "Failed to approve application.",
            "danger",
          );
          setIsProcessing(false);
        }
      },
    );
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      showMessage("Warning", "Please provide a rejection reason.", "danger");
      return;
    }
    setIsProcessing(true);
    try {
      await adminProviderService.rejectApplication(companyId, rejectReason);
      showMessage(
        "Rejected",
        "Company Application Rejected.",
        "info",
        () => {
          onStatusChanged();
        },
        false,
      );
    } catch (err: any) {
      showMessage(
        "Error",
        err.message || "Failed to reject application.",
        "danger",
      );
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
                      <div
                        key={doc.id}
                        onClick={() => setPreviewUrl(doc.documentUrl)}
                        className="group flex flex-col p-4 bg-white border border-gray-200 rounded-2xl hover:border-primary hover:shadow-lg transition-all cursor-pointer"
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
                      </div>
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

      {/* Internal Document Preview Overlay */}
      {previewUrl && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setPreviewUrl(null)}
          ></div>
          <div className="relative max-w-5xl w-full h-full max-h-[85vh] flex flex-col">
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-primary transition-colors bg-white/10 rounded-full"
            >
              <X size={24} />
            </button>
            <div className="bg-white rounded-3xl overflow-hidden h-full flex items-center justify-center p-2 shadow-2xl">
              <img
                src={previewUrl}
                alt="Document Preview"
                className="max-w-full max-h-full object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() =>
              !isProcessing &&
              setConfirmModal((prev) => ({ ...prev, isOpen: false }))
            }
          ></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div
                className={`p-4 rounded-2xl mb-4 ${
                  confirmModal.type === "success"
                    ? "bg-emerald-100 text-emerald-600"
                    : confirmModal.type === "danger"
                      ? "bg-red-100 text-red-600"
                      : "bg-blue-100 text-blue-600"
                }`}
              >
                {confirmModal.type === "success" ? (
                  <CheckCircle size={32} />
                ) : confirmModal.type === "danger" ? (
                  <XCircle size={32} />
                ) : (
                  <AlertCircle size={32} />
                )}
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">
                {confirmModal.title}
              </h3>
              <p className="text-gray-500 font-medium mb-8">
                {confirmModal.message}
              </p>

              <div className="flex gap-3 w-full">
                {confirmModal.showConfirmButton ? (
                  <>
                    <button
                      onClick={() =>
                        setConfirmModal((prev) => ({ ...prev, isOpen: false }))
                      }
                      className="flex-1 px-6 py-3 rounded-xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (confirmModal.onConfirm) confirmModal.onConfirm();
                        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                      }}
                      className={`flex-1 px-6 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${
                        confirmModal.type === "danger"
                          ? "bg-red-500 hover:bg-red-600 shadow-red-200"
                          : "bg-primary hover:bg-primary-dark shadow-primary/20"
                      }`}
                    >
                      Confirm
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      if (confirmModal.onConfirm) confirmModal.onConfirm();
                      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                    }}
                    className="w-full px-6 py-3 rounded-xl font-bold bg-primary text-white hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                  >
                    Got it
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourCompanyDetailsModal;
