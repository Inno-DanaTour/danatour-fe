import React, { useState, useEffect } from "react";
import { CreditCard, Plus, Trash2, CheckCircle, Loader2, AlertCircle, Banknote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { paymentMethodService, PaymentMethod, VietQRBank } from "../../checkout/services/paymentMethodService";

const PaymentMethodsTab: React.FC = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [banks, setBanks] = useState<VietQRBank[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    provider: "VIETQR",
    bankBin: "",
    bankShortName: "",
    bankAccountNumber: "",
    bankAccountName: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [methodsData, banksData] = await Promise.all([
        paymentMethodService.getAll(),
        paymentMethodService.getVietQRBanks(),
      ]);
      setMethods(methodsData);
      setBanks(banksData);
    } catch (err: any) {
      setError(err.message || "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await paymentMethodService.add(formData);
      setIsAdding(false);
      setFormData({
        provider: "VIETQR",
        bankBin: "",
        bankShortName: "",
        bankAccountNumber: "",
        bankAccountName: "",
      });
      fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to add payment method");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this payment method?")) return;
    try {
      await paymentMethodService.delete(id);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Delete failed");
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await paymentMethodService.setAsDefault(id);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to set default");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-2 text-gray-500 font-medium">Loading payment methods...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Payment Methods</h2>
          <p className="text-gray-500 text-sm font-medium">Manage how customers pay for your tours.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="btn-primary px-6 py-2.5 flex items-center gap-2 rounded-xl text-sm"
        >
          {isAdding ? "Cancel" : <><Plus size={18} /> Add New</>}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Add Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAdd} className="bg-gray-50 p-6 md:p-8 rounded-[2rem] border border-gray-100 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Select Bank</label>
                  <select
                    required
                    value={formData.bankBin}
                    onChange={(e) => {
                      const selectedBank = banks.find(b => b.bin === e.target.value);
                      setFormData({
                        ...formData,
                        bankBin: e.target.value,
                        bankShortName: selectedBank?.shortName || "",
                      });
                    }}
                    className="input py-3.5 px-4 rounded-xl text-sm"
                  >
                    <option value="">Choose a bank...</option>
                    {banks.map(bank => (
                      <option key={bank.bin} value={bank.bin}>{bank.shortName} - {bank.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Account Number</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter account number"
                    value={formData.bankAccountNumber}
                    onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                    className="input py-3.5 px-4 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Account Holder Name</label>
                  <input
                    type="text"
                    required
                    placeholder="ENTER ACCOUNT NAME (NO ACCENTS)"
                    value={formData.bankAccountName}
                    onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value.toUpperCase() })}
                    className="input py-3.5 px-4 rounded-xl text-sm uppercase"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full py-4 rounded-2xl font-black">
                Save Payment Method
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {methods.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
            <Banknote size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-bold">No payment methods configured yet.</p>
          </div>
        ) : (
          methods.map((method) => (
            <div key={method.id} className="relative group overflow-hidden">
               <div className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${method.isDefault ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                <div className="flex items-center gap-4">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${method.isDefault ? 'bg-primary text-white' : 'bg-gray-50 text-gray-400'}`}>
                    <Banknote size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <h4 className="font-black text-gray-900">{method.bankShortName}</h4>
                       {method.isDefault && (
                         <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Default</span>
                       )}
                    </div>
                    <p className="text-gray-500 font-bold text-sm tracking-wider">{method.bankAccountNumber}</p>
                    <p className="text-gray-400 text-xs font-medium uppercase">{method.bankAccountName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-primary transition-colors"
                      title="Set as Default"
                    >
                      <CheckCircle size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(method.id)}
                    className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PaymentMethodsTab;
