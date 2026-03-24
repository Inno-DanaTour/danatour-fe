import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import { refundService, RefundDetailResponse } from "../../services/refundService";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

const RefundDetailView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [refund, setRefund] = useState<RefundDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) {
        setError("Missing refund request id.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const detail = await refundService.getRefundDetails(Number(id));
        setRefund(detail);
      } catch (err: any) {
        setError(err.message || "Cannot load refund details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <Header />

      <main className="pt-24 md:pt-32 px-4 md:px-6 max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/my-bookings")}
          className="inline-flex items-center gap-2 mb-6 text-sm font-black text-gray-600 hover:text-primary"
        >
          <ArrowLeft size={16} /> Back to My Bookings
        </button>

        <section className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-black/5 border border-gray-100">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="mt-4 text-gray-500 font-bold">Loading refund detail...</p>
            </div>
          ) : error ? (
            <div className="py-16 text-center">
              <AlertCircle className="mx-auto text-red-400 mb-4" size={44} />
              <p className="text-red-500 font-bold">{error}</p>
            </div>
          ) : refund ? (
            <>
              <div className="mb-6 text-center">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900">
                  Refund <span className="text-primary">Processing</span>
                </h1>
                <p className="text-gray-500 mt-2 font-medium">
                  Show this QR code to admin to complete the transfer.
                </p>
              </div>

              <div className="flex justify-center mb-8">
                <div className="bg-white p-4 rounded-[2rem] shadow-inner border border-gray-100">
                  <img src={refund.vietQrUrl} alt="Refund QR" className="w-64 h-64 object-contain" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                  <p className="font-black text-gray-900">{refund.status}</p>
                </div>
                <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Amount</p>
                  <p className="font-black text-primary">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(refund.amount)}
                  </p>
                </div>
                <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Bank</p>
                  <p className="font-bold text-gray-700">{refund.bankShortName}</p>
                </div>
                <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Account Number</p>
                  <p className="font-bold text-gray-700 tracking-wider">{refund.bankAccountNumber}</p>
                </div>
                <div className="md:col-span-2 bg-neutral-50 rounded-2xl p-5 border border-neutral-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Account Name</p>
                  <p className="font-bold text-gray-700 uppercase">{refund.bankAccountName}</p>
                </div>
              </div>
            </>
          ) : null}
        </section>
      </main>
    </div>
  );
};

export default RefundDetailView;
