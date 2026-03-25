import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader2, Search, Banknote, Calendar, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { refundService, RefundDetailResponse, RefundRequest } from "../checkout/services/refundService";

const AdminRefundPortal: React.FC = () => {
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<number | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [activeRefundDetail, setActiveRefundDetail] = useState<RefundDetailResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, refundId: number | null}>({ isOpen: false, refundId: null });
  const [statusModal, setStatusModal] = useState<{ isOpen: boolean; type: "success" | "error"; message: string; description?: string; }>({ isOpen: false, type: "success", message: "" });

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    setIsLoading(true);
    try {
      const data = await refundService.getPendingRefunds();
      setRefunds(data);
    } catch (err) {
      console.error("Failed to fetch refunds", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveClick = (id: number) => {
    setConfirmModal({ isOpen: true, refundId: id });
  };

  const confirmApprove = async () => {
    if (!confirmModal.refundId) return;
    const id = confirmModal.refundId;
    
    setIsProcessing(id);
    setConfirmModal({ isOpen: false, refundId: null });
    
    try {
      await refundService.completeRefund(id);
      fetchRefunds();
      setActiveRefundDetail(null);
      setStatusModal({ isOpen: true, type: "success", message: "Refund approved successfully!", description: "The customer's booking status has been updated to REFUNDED." });
    } catch (err) {
      setStatusModal({ isOpen: true, type: "error", message: "Failed to approve refund.", description: "Please check your connection and try again." });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleOpenRefundDetail = async (id: number) => {
    setIsLoadingDetail(true);
    try {
      const detail = await refundService.getRefundDetails(id);
      setActiveRefundDetail(detail);
    } catch (err) {
      alert("Failed to load refund QR details.");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const filteredRefunds = refunds.filter(r => 
    r.bankAccountNumber.includes(searchTerm) || 
    r.bankAccountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.bookingId.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Refund <span className="text-primary tracking-tighter">Portal</span></h1>
          <p className="text-gray-500 font-medium">Manage and process pending refund requests from customers.</p>
        </header>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Search by account number, name or booking ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white rounded-3xl border border-gray-100 shadow-sm focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium"
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-xs">Loading requests...</p>
          </div>
        ) : filteredRefunds.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
             <Banknote size={48} className="mx-auto text-gray-200 mb-4" />
             <p className="text-gray-400 font-bold">No pending refund requests found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence>
              {filteredRefunds.map((refund) => (
                <motion.div 
                  key={refund.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-black/5 border border-gray-100 flex flex-col md:flex-row gap-8 items-start md:items-center hover:shadow-2xl transition-all"
                >
                  <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Customer & Booking */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer ID</p>
                          <p className="font-bold text-gray-900">#USER_{refund.userId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                          <Calendar size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Booking ID</p>
                          <p className="font-bold text-gray-900">#BOOK_{refund.bookingId}</p>
                        </div>
                      </div>
                    </div>

                    {/* Amount & Reason */}
                    <div className="space-y-4 md:border-x md:border-dashed md:border-gray-100 md:px-8">
                       <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Refund Amount</p>
                         <p className="text-2xl font-black text-primary leading-tight">
                            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(refund.amount)}
                         </p>
                       </div>
                       <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Reason</p>
                         <p className="text-sm text-gray-500 font-medium line-clamp-2 italic">"{refund.reason || "No reason provided"}"</p>
                       </div>
                    </div>

                    {/* Bank Info */}
                    <div className="bg-neutral-50 p-5 rounded-2xl space-y-2">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Target Bank Account</p>
                       <div className="flex justify-between items-center text-sm">
                         <span className="text-gray-500">Bank:</span>
                         <span className="font-bold text-gray-900">{refund.bankShortName}</span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                         <span className="text-gray-500">Account:</span>
                         <span className="font-bold text-gray-900 tracking-wider font-mono">{refund.bankAccountNumber}</span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                         <span className="text-gray-500">Holder:</span>
                         <span className="font-bold text-gray-900 uppercase truncate ml-4">{refund.bankAccountName}</span>
                       </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex flex-row md:flex-col gap-3 w-full md:w-auto">
                    <button
                      onClick={() => handleOpenRefundDetail(refund.id)}
                      disabled={isLoadingDetail}
                      className="flex-1 md:w-40 py-4 bg-primary text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                    >
                      {isLoadingDetail ? <Loader2 size={18} className="animate-spin" /> : "View QR"}
                    </button>
                    <button 
                      onClick={() => handleApproveClick(refund.id)}
                      disabled={isProcessing === refund.id}
                      className="flex-1 md:w-40 py-4 bg-gray-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-black/10 disabled:opacity-50"
                    >
                      {isProcessing === refund.id ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle size={18} /> Confirm</>}
                    </button>
                    <button className="flex-1 md:w-40 py-4 border-2 border-gray-100 text-gray-400 rounded-2xl font-black hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-2">
                      <XCircle size={18} /> Reject
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      <AnimatePresence>
        {activeRefundDetail && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveRefundDetail(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-6 md:p-8"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Refund QR for Admin</h2>
                  <p className="text-gray-500 font-medium">Scan this QR in banking app to auto-fill transfer info.</p>
                </div>
                <button
                  onClick={() => setActiveRefundDetail(null)}
                  title="Close"
                  className="p-2 text-gray-500 hover:text-gray-900"
                >
                  <XCircle size={22} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-inner flex justify-center">
                  <img
                    src={activeRefundDetail.vietQrUrl}
                    alt="Refund QR"
                    className="w-64 h-64 object-contain"
                  />
                </div>

                <div className="space-y-3 bg-neutral-50 p-5 rounded-2xl border border-neutral-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Request ID</span>
                    <span className="font-black text-gray-900">#{activeRefundDetail.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Booking ID</span>
                    <span className="font-black text-gray-900">#BOOK_{activeRefundDetail.bookingId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-black text-primary">
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(activeRefundDetail.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Bank</span>
                    <span className="font-bold text-gray-900">{activeRefundDetail.bankShortName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Account</span>
                    <span className="font-bold text-gray-900 tracking-wider">{activeRefundDetail.bankAccountNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Holder</span>
                    <span className="font-bold text-gray-900 uppercase text-right">{activeRefundDetail.bankAccountName}</span>
                  </div>

                  <button
                    onClick={() => handleApproveClick(activeRefundDetail.id)}
                    disabled={isProcessing === activeRefundDetail.id}
                    className="w-full mt-3 py-3.5 bg-gray-900 text-white rounded-2xl font-black hover:bg-gray-800 transition-all disabled:opacity-50"
                  >
                    {isProcessing === activeRefundDetail.id ? (
                      <span className="flex items-center justify-center gap-2"><Loader2 size={18} className="animate-spin" /> Processing...</span>
                    ) : (
                      "Confirm Refund"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmModal({ isOpen: false, refundId: null })}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-gray-100"
            >
              <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-6">
                <Banknote size={40} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 text-center tracking-tight">Confirm Refund?</h3>
              <p className="text-gray-500 font-medium text-center mb-8">
                Are you sure you have successfully transferred the money to the customer's bank account? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setConfirmModal({ isOpen: false, refundId: null })}
                  className="flex-1 py-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-2xl font-black transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmApprove}
                  className="flex-1 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-black shadow-xl shadow-black/10 transition-all"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Status Modal */}
      <AnimatePresence>
        {statusModal.isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setStatusModal({ ...statusModal, isOpen: false })}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden text-center p-10"
            >
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  statusModal.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                }`}
              >
                {statusModal.type === "success" ? <CheckCircle size={40} /> : <XCircle size={40} />}
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">{statusModal.message}</h3>
              <p className="text-gray-500 font-medium mb-8">{statusModal.description}</p>
              <button
                onClick={() => setStatusModal({ ...statusModal, isOpen: false })}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black shadow-xl hover:bg-black transition-all"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminRefundPortal;
