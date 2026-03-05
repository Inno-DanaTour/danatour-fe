import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Trash2, ShieldCheck, AlertCircle, Loader2, CheckCircle2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../configs/api';
import Header from "../../components/layout/Header";

// --- Type Definitions ---
interface PaymentCard {
  id: string | number;
  provider: 'VISA' | 'Mastercard' | string;
  cardNumber: string; // Số thẻ đầy đủ hoặc bị che từ Backend
  cardHolderName?: string;
  default?: boolean;
}

interface NewCardForm {
  cardHolderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  isDefault: boolean;
}

const API_ENDPOINT = '/api/v1/payment-methods';

const PaymentMethodManager: React.FC = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<PaymentCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState<NewCardForm>({
    cardHolderName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    isDefault: false,
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [shake, setShake] = useState(false);

  // --- Helper Functions ---
  const validateLuhn = (num: string) => {
    const digits = num.replace(/\D/g, '');
    if (digits.length < 13) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits.charAt(i));
      if (shouldDouble) {
        if ((digit *= 2) > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return (sum % 10) === 0;
  };

  const validateExpiry = (expiry: string) => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return "Format MM/YY required";
    const [month, year] = expiry.split('/').map(n => parseInt(n));
    if (month < 1 || month > 12) return "Month: 01-12";
    
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return "Card has expired";
    }
    return "";
  };

  const getFormErrors = (data: NewCardForm) => {
    const errors: Record<string, string> = {};
    if (!data.cardHolderName || data.cardHolderName.length < 3) errors.cardHolderName = "Name too short";
    
    const rawCard = data.cardNumber.replace(/\s/g, '');
    if (rawCard.length < 16) errors.cardNumber = "Card number must be 16 digits";
    else if (!validateLuhn(rawCard)) errors.cardNumber = "Invalid card number (Luhn check failed)";
    
    const expiryError = validateExpiry(data.expiry);
    if (expiryError) errors.expiry = expiryError;
    
    if (data.cvv.length < 3) errors.cvv = "CVV must be 3 digits";
    
    return errors;
  };

  useEffect(() => {
    setFormErrors(getFormErrors(formData));
  }, [formData]);

  const maskCardNumber = (num: string) => {
    if (!num || num.length < 4) return '**** **** **** ****';
    const last4 = num.slice(-4);
    return `**** **** **** ${last4}`;
  };

  const formatCardInput = (value: string) => {
    const v = value.replace(/\D/g, '');
    const parts = v.match(/.{1,4}/g);
    return parts ? parts.join(' ') : v;
  };

  // --- API Calls ---
  const fetchCards = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get<PaymentCard[]>(API_ENDPOINT);
      setCards(response || []);
    } catch (err: any) {
      console.error('Fetch cards error:', err);
      setError(err.message || 'Đã có lỗi xảy ra khi tải danh sách thẻ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const errors = getFormErrors(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setTouched({
        cardHolderName: true,
        cardNumber: true,
        expiry: true,
        cvv: true
      });
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setSubmitLoading(true);

    const rawCardNum = formData.cardNumber.replace(/\s/g, '');
    const payload = {
      provider: getCardProvider(rawCardNum),
      cardNumber: rawCardNum,
      default: formData.isDefault,
    };

    try {
      await api.post(API_ENDPOINT, payload);
      setFormData({
        cardHolderName: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        isDefault: false,
      });
      setTouched({});
      await fetchCards();
    } catch (err: any) {
      setError(err.message || 'Không thể thêm thẻ mới. Vui lòng thử lại.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const getCardProvider = (cardNumber: string) => {
    if (cardNumber.startsWith('4')) return 'VISA';
    if (/^5[1-5]/.test(cardNumber)) return 'Mastercard';
    return 'VISA';
  };

  const handleDeleteCard = async (id: string | number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thẻ này?')) return;

    try {
      await api.put(`${API_ENDPOINT}/${id}`);
      // Optimistic UI update
      setCards((prev) => prev.filter((card) => card.id !== id));
    } catch (err: any) {
      console.error('Delete card error:', err);
      setError(err.message || 'Xóa thẻ thất bại.');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header onBookClick={() => navigate("/tours")} />

      <main className="pt-24 md:pt-32 px-4 md:px-6 max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-2">
            Payment <span className="text-primary">Methods</span>
          </h1>
          <p className="text-gray-500 font-medium">
            Manage your saved cards and payment preferences.
          </p>
        </header>

      {/* Error Message */}
      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 text-red-500 p-6 rounded-3xl mb-10 flex items-center gap-4 border border-red-100">
          <AlertCircle className="shrink-0" />
          <span className="font-bold">{error}</span>
        </motion.div>
      )}

      {/* Danh sách thẻ đã lưu */}
      <section className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-black/5 space-y-8">
        <h3 className="text-2xl font-black flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">1</span>
            Saved Cards
        </h3>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 text-gray-500">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="font-bold">Loading your cards...</p>
          </div>
        ) : cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 text-gray-400">
            <CreditCard size={48} className="mb-4 opacity-50" />
            <p className="font-medium">No payment methods found. Add a new card below.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                  className={`relative overflow-hidden p-6 rounded-3xl text-white shadow-xl transition-transform hover:-translate-y-1 ${card.default ? 'bg-gradient-to-br from-primary to-blue-800' : 'bg-gradient-to-br from-slate-800 to-slate-900'}`}
                >
                  {/* Glowing background effect for default card */}
                  {card.default && (
                    <div className="absolute inset-0 bg-white/5 opacity-50 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2), transparent 60%)' }} />
                  )}

                  <div className="relative z-10 flex flex-col h-full justify-between min-h-[160px]">
                    <div className="flex justify-between items-start">
                      <span className="font-display font-bold text-xl italic tracking-wider opacity-90">{card.provider || 'VISA'}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteCard(card.id)}
                        className="bg-white/20 hover:bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all focus:outline-none"
                        title="Delete Card"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div className="font-mono text-2xl tracking-widest my-6 text-white/95 text-shadow-sm">
                      {maskCardNumber(card.cardNumber)}
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Cardholder</span>
                        <span className="font-bold tracking-wider uppercase text-sm">{card.cardHolderName || 'KHAI TRANG'}</span>
                      </div>
                      {card.default && (
                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Form thêm thẻ mới */}
      <section className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-black/5 space-y-8">
        <h3 className="text-2xl font-black flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-accent/20 text-yellow-600 flex items-center justify-center">2</span>
            Add New Card
        </h3>

        <motion.form 
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          onSubmit={handleAddCard} 
          className="space-y-6"
        >
          {/* Cardholder Name */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-black uppercase tracking-widest text-gray-400">Name on Card</label>
              <AnimatePresence>
                {touched.cardHolderName && formErrors.cardHolderName && (
                  <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-xs font-bold text-red-500">
                    {formErrors.cardHolderName}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="NGUYEN VAN A"
                value={formData.cardHolderName}
                onBlur={() => setTouched(prev => ({ ...prev, cardHolderName: true }))}
                onChange={(e) => setFormData({ ...formData, cardHolderName: e.target.value.toUpperCase() })}
                required
                className={`w-full bg-gray-50 border-2 rounded-2xl p-5 transition-all text-lg font-medium outline-none ${touched.cardHolderName ? (formErrors.cardHolderName ? 'border-red-200 focus:border-red-500' : 'border-green-100 focus:border-green-500') : 'border-transparent focus:border-primary/20'}`}
              />
              {touched.cardHolderName && !formErrors.cardHolderName && (
                <CheckCircle2 className="absolute right-5 top-1/2 -translate-y-1/2 text-green-500" size={20} />
              )}
            </div>
          </div>

          {/* Card Number */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-black uppercase tracking-widest text-gray-400">Card Number</label>
              <AnimatePresence>
                {touched.cardNumber && formErrors.cardNumber && (
                  <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-xs font-bold text-red-500">
                    {formErrors.cardNumber}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <div className="relative flex items-center">
              <CreditCard size={20} className={`absolute left-5 transition-colors ${touched.cardNumber ? (formErrors.cardNumber ? 'text-red-400' : 'text-green-500') : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                value={formData.cardNumber}
                onBlur={() => setTouched(prev => ({ ...prev, cardNumber: true }))}
                onChange={(e) => setFormData({ ...formData, cardNumber: formatCardInput(e.target.value) })}
                required
                className={`w-full bg-gray-50 border-2 rounded-2xl p-5 pl-14 transition-all text-lg font-medium font-mono outline-none ${touched.cardNumber ? (formErrors.cardNumber ? 'border-red-200 focus:border-red-500' : 'border-green-100 focus:border-green-500') : 'border-transparent focus:border-primary/20'}`}
              />
              {touched.cardNumber && !formErrors.cardNumber && (
                <CheckCircle2 className="absolute right-5 text-green-500" size={20} />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Expiry */}
            <div className="space-y-2">
              <div className="flex justify-between items-end flex-wrap gap-x-2">
                <label className="text-sm font-black uppercase tracking-widest text-gray-400">Expiry</label>
                <AnimatePresence>
                  {touched.expiry && formErrors.expiry && (
                    <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-[10px] font-bold text-red-500">
                      {formErrors.expiry}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <input
                type="text"
                placeholder="MM/YY"
                maxLength={5}
                value={formData.expiry}
                onBlur={() => setTouched(prev => ({ ...prev, expiry: true }))}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, '');
                  if (val.length >= 3) {
                    val = `${val.slice(0, 2)}/${val.slice(2, 4)}`;
                  }
                  setFormData({ ...formData, expiry: val });
                }}
                required
                className={`w-full bg-gray-50 border-2 rounded-2xl p-5 transition-all text-lg font-medium text-center tracking-widest outline-none ${touched.expiry ? (formErrors.expiry ? 'border-red-200 focus:border-red-500' : 'border-green-100 focus:border-green-500') : 'border-transparent focus:border-primary/20'}`}
              />
            </div>

            {/* CVV */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label className="text-sm font-black uppercase tracking-widest text-gray-400">CVV</label>
                <AnimatePresence>
                  {touched.cvv && formErrors.cvv && (
                    <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-[10px] font-bold text-red-500">
                      {formErrors.cvv}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <input
                type="password"
                placeholder="•••"
                maxLength={3}
                value={formData.cvv}
                onBlur={() => setTouched(prev => ({ ...prev, cvv: true }))}
                onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })}
                required
                className={`w-full bg-gray-50 border-2 rounded-2xl p-5 transition-all text-lg font-medium text-center tracking-widest outline-none ${touched.cvv ? (formErrors.cvv ? 'border-red-200 focus:border-red-500' : 'border-green-100 focus:border-green-500') : 'border-transparent focus:border-primary/20'}`}
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer group mt-4 w-max">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              />
              <div className="w-6 h-6 rounded-md border-2 border-gray-300 peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {formData.isDefault && (
                  <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </motion.svg>
                )}
              </div>
            </div>
            <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">
              Set as default payment method
            </span>
          </label>

          <div className="pt-6 flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
              <ShieldCheck size={16} className="text-green-500" />
              Secured by 256-bit SSL encryption
            </div>
            <div className="flex-grow"></div>
            <motion.button
              whileHover={Object.keys(formErrors).length === 0 ? { scale: 1.02 } : {}}
              whileTap={Object.keys(formErrors).length === 0 ? { scale: 0.98 } : {}}
              type="submit"
              disabled={submitLoading}
              className={`btn-primary py-5 px-10 text-lg font-black shadow-2xl flex items-center justify-center gap-3 rounded-2xl w-full md:w-auto transition-all ${Object.keys(formErrors).length > 0 && Object.keys(touched).length > 0 ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'shadow-primary/30'}`}
            >
              {submitLoading ? (
                 <>
                   <Loader2 className="animate-spin" size={24} />
                   Processing...
                 </>
              ) : (
                 <>
                   <ShieldCheck size={24} />
                   Save Card Securely
                 </>
              )}
            </motion.button>
          </div>
        </motion.form>
      </section>
      </main>
    </div>
  );
};

export default PaymentMethodManager;
