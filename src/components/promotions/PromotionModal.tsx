import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    TicketPercent,
    Percent,
    CreditCard,
    Calendar,
    Tag,
    Info,
    ChevronRight,
    Check,
    Search,
    Package,
    Loader2
} from "lucide-react";
import { tourService } from "../../pages/tours/services/tourService";
import { promotionService } from "../../pages/promotions/services/promotionService";
import { TourListItem } from "../../pages/tours/types";
import { PromotionRequest, PromotionResponse } from "../../pages/promotions/types";

interface PromotionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    role: "ADMIN" | "COMPANY";
    companyId?: number;
    mode?: "CREATE" | "EDIT";
    initialData?: PromotionResponse;
}

const PromotionModal: React.FC<PromotionModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    role,
    companyId,
    mode = "CREATE",
    initialData
}) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [availableTours, setAvailableTours] = useState<TourListItem[]>([]);
    const [tourSearch, setTourSearch] = useState("");
    const [toursLoading, setToursLoading] = useState(false);

    const formatLocalISO = (date: Date) => {
        const offset = date.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
        return localISOTime;
    };

    // Form State
    const [formData, setFormData] = useState<Partial<PromotionRequest>>({
        discountType: "PERCENTAGE",
        tourIds: [],
        validFrom: formatLocalISO(new Date()),
        validTo: formatLocalISO(new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)),
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const isUsed = mode === "EDIT" && !!initialData && (initialData.usedCount || 0) > 0;

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setErrors({});
            setSuccess(false);
            if (mode === "EDIT" && initialData) {
                setFormData({
                    code: initialData.code,
                    title: initialData.title || "",
                    discountType: initialData.discountType,
                    discountValue: initialData.discountValue,
                    maxDiscountAmount: initialData.maxDiscountAmount || undefined,
                    usageLimit: initialData.usageLimit || undefined,
                    validFrom: formatLocalISO(new Date(initialData.validFrom)),
                    validTo: formatLocalISO(new Date(initialData.validTo)),
                    tourIds: initialData.appliedTours?.map(t => t.id) || []
                });
            } else {
                setFormData({
                    discountType: "PERCENTAGE",
                    tourIds: [],
                    validFrom: formatLocalISO(new Date()),
                    validTo: formatLocalISO(new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)),
                    code: "",
                    title: "",
                    discountValue: undefined,
                    maxDiscountAmount: undefined,
                    usageLimit: undefined
                });
            }
        }
    }, [isOpen, mode, initialData]);

    useEffect(() => {
        if (isOpen && step === 2) {
            fetchTours();
        }
    }, [isOpen, step, role, companyId]);

    const fetchTours = async () => {
        try {
            setToursLoading(true);
            // If admin, we can search all tours. If company, only their own.
            const response = await tourService.getTours(1, 100, role === "COMPANY" ? companyId : undefined);
            setAvailableTours(response.content);
        } catch (err) {
            console.error("Failed to load tours", err);
        } finally {
            setToursLoading(false);
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.code) newErrors.code = "Code is required";
        if (!formData.discountValue) newErrors.discountValue = "Value is required";
        if (formData.discountType === "PERCENTAGE" && (Number(formData.discountValue) > 100 || Number(formData.discountValue) <= 0)) {
            newErrors.discountValue = "Must be between 1 and 100";
        }
        if (mode === "EDIT" && initialData && formData.usageLimit && initialData.usedCount && Number(formData.usageLimit) < initialData.usedCount) {
            newErrors.usageLimit = `Must be >= current used count (${initialData.usedCount})`;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            setLoading(true);
            const requestData = {
                ...formData,
                discountValue: Number(formData.discountValue),
                maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : undefined,
                usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
            } as PromotionRequest;

            if (mode === "EDIT" && initialData) {
                if (role === "ADMIN") {
                    await promotionService.updateAdminPromotion(initialData.id, requestData);
                } else {
                    await promotionService.updateCompanyPromotion(initialData.id, requestData);
                }
            } else {
                if (role === "ADMIN") {
                    await promotionService.createAdminPromotion(requestData);
                } else {
                    await promotionService.createCompanyPromotion(requestData);
                }
            }
            setSuccess(true);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);
        } catch (err: any) {
            console.error("Failed to create promotion", err);
            // Handle both ApiResponse format and direct error message
            const serverMessage = err.response?.data?.message || err.message || "Failed to create promotion";
            setErrors({ server: serverMessage });
        } finally {
            setLoading(false);
        }
    };

    const toggleTourSelection = (id: number) => {
        const current = formData.tourIds || [];
        if (current.includes(id)) {
            setFormData({ ...formData, tourIds: current.filter(tid => tid !== id) });
        } else {
            setFormData({ ...formData, tourIds: [...current, id] });
        }
    };

    const handleSelectAll = (visibleTours: TourListItem[]) => {
        const currentIds = formData.tourIds || [];
        const allVisibleIds = visibleTours.map(t => t.id);
        const allSelected = allVisibleIds.every(id => currentIds.includes(id));

        if (allSelected) {
            // Deselect all visible
            setFormData({ ...formData, tourIds: currentIds.filter(id => !allVisibleIds.includes(id)) });
        } else {
            // Select all visible (preserving others)
            const newIds = Array.from(new Set([...currentIds, ...allVisibleIds]));
            setFormData({ ...formData, tourIds: newIds });
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                >
                    {success ? (
                        <div className="p-20 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6"
                            >
                                <Check size={48} strokeWidth={3} />
                            </motion.div>
                            <h2 className="text-3xl font-black text-gray-900 mb-2">
                                {mode === "EDIT" ? "Promotion Updated!" : "Promotion Created!"}
                            </h2>
                            <p className="text-gray-500 font-medium">
                                The promotion has been successfully saved to the system.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                                        <TicketPercent size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900 tracking-tighter">
                                            {mode === "EDIT" ? "Edit Promotion" : (role === "ADMIN" ? "Global Campaign" : "New Tour Promotion")}
                                        </h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-primary' : 'bg-gray-200'}`} />
                                            <div className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-primary' : 'bg-gray-200'}`} />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                                                Step {step} of 2
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto p-8">
                                {step === 1 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Left Side: General Info */}
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Promo Code</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. SUMMER2024"
                                                    className={`w-full ${mode === "EDIT" ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-50'} border-none rounded-2xl py-4 px-6 font-mono text-xl font-bold tracking-widest focus:ring-2 ${errors.code ? 'ring-2 ring-red-500' : 'focus:ring-primary/20'}`}
                                                    value={formData.code || ""}
                                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                                    disabled={mode === "EDIT"}
                                                />
                                                {errors.code && <p className="text-red-500 text-[10px] font-black mt-2 ml-1 uppercase">{errors.code}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Campaign Title</label>
                                                <input
                                                    type="text"
                                                    placeholder="Special Summer Sale"
                                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-2 focus:ring-primary/20"
                                                    value={formData.title || ""}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Starts From</label>
                                                    <div className="relative">
                                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                        <input
                                                            type="datetime-local"
                                                            className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-sm focus:ring-2 focus:ring-primary/20"
                                                            value={formData.validFrom}
                                                            onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Ends At</label>
                                                    <div className="relative">
                                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                        <input
                                                            type="datetime-local"
                                                            className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-sm focus:ring-2 focus:ring-primary/20"
                                                            value={formData.validTo}
                                                            onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side: Discount Configuration */}
                                        <div className="bg-gray-50 rounded-[2.5rem] p-8 space-y-6 border border-gray-100">
                                            <div className="flex p-1.5 bg-white rounded-2xl shadow-sm border border-gray-100">
                                                <button
                                                    onClick={() => setFormData({ ...formData, discountType: 'PERCENTAGE' })}
                                                    disabled={isUsed}
                                                    className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-black text-xs uppercase transition-all ${formData.discountType === 'PERCENTAGE' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-gray-400 hover:text-gray-900'} ${isUsed ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <Percent size={16} /> Percentage
                                                </button>
                                                <button
                                                    onClick={() => setFormData({ ...formData, discountType: 'FIXED_AMOUNT' })}
                                                    disabled={isUsed}
                                                    className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-black text-xs uppercase transition-all ${formData.discountType === 'FIXED_AMOUNT' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-gray-400 hover:text-gray-900'} ${isUsed ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <CreditCard size={16} /> Fixed Amount
                                                </button>
                                            </div>

                                            {isUsed && (
                                                <div className="px-4 py-2 bg-red-50 rounded-xl flex items-center gap-2 border border-red-100">
                                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">
                                                        Locked: In Use ({initialData?.usedCount} redeems)
                                                    </p>
                                                </div>
                                            )}

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                                                        {formData.discountType === 'PERCENTAGE' ? 'Discount Percentage (%)' : 'Deduction Amount (VND)'}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        placeholder={formData.discountType === 'PERCENTAGE' ? "10" : "50,000"}
                                                        className={`w-full ${isUsed ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'} border border-gray-200 rounded-2xl py-4 px-6 font-black text-xl text-cta focus:ring-2 focus:ring-primary/20 ${errors.discountValue ? 'border-red-500' : ''}`}
                                                        value={formData.discountValue || ""}
                                                        onChange={(e) => setFormData({ ...formData, discountValue: e.target.value as any })}
                                                        disabled={isUsed}
                                                    />
                                                    {errors.discountValue && <p className="text-red-500 text-[10px] font-black mt-2 ml-1 uppercase">{errors.discountValue}</p>}
                                                </div>

                                                {formData.discountType === 'PERCENTAGE' && (
                                                    <div>
                                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Cap Discount At (Optional)</label>
                                                        <input
                                                            type="number"
                                                            placeholder="Maximum VND allowed"
                                                            className={`w-full ${isUsed ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'} border border-gray-200 rounded-2xl py-4 px-6 font-bold focus:ring-2 focus:ring-primary/20`}
                                                            value={formData.maxDiscountAmount || ""}
                                                            onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value as any })}
                                                            disabled={isUsed}
                                                        />
                                                    </div>
                                                )}

                                                <div>
                                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Usage Limit</label>
                                                    <div className="relative">
                                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                                        <input
                                                            type="number"
                                                            placeholder="e.g. 100 uses"
                                                            className={`w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-6 font-bold focus:ring-2 ${errors.usageLimit ? 'border-red-500 focus:ring-red-500/20' : 'focus:ring-primary/20'}`}
                                                            value={formData.usageLimit || ""}
                                                            onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value as any })}
                                                        />
                                                    </div>
                                                    {errors.usageLimit && <p className="text-red-500 text-[10px] font-black mt-2 ml-1 uppercase">{errors.usageLimit}</p>}
                                                </div>
                                            </div>

                                            <div className="bg-blue-50/50 rounded-2xl p-4 flex gap-3 border border-blue-100">
                                                <Info className="text-blue-500 shrink-0" size={20} />
                                                <p className="text-[11px] font-medium text-blue-700 leading-relaxed">
                                                    {formData.discountType === 'PERCENTAGE'
                                                        ? "Calculates a percentage off the base tour price. You can set a maximum cap to manage your budget."
                                                        : "Subtracts a fixed amount from every booking regardless of the total tour cost."
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-xl font-black mb-1">Select Applicable Tours</h3>
                                            <p className="text-gray-500 text-sm font-medium mb-6">
                                                {role === "ADMIN"
                                                    ? "Choose specific tours or leave empty for a platform-wide effect."
                                                    : "Choose one or more of your tours to apply this discount."}
                                            </p>

                                            <div className="flex gap-3 mb-6">
                                                <div className="relative flex-1">
                                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                    <input
                                                        type="text"
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 font-medium focus:ring-2 focus:ring-primary/20"
                                                        placeholder="Search your tours..."
                                                        value={tourSearch}
                                                        onChange={(e) => setTourSearch(e.target.value)}
                                                    />
                                                </div>
                                                {availableTours.length > 0 && (
                                                    <button
                                                        onClick={() => handleSelectAll(availableTours.filter(t => t.title.toLowerCase().includes(tourSearch.toLowerCase())))}
                                                        className="px-6 py-4 bg-gray-50 hover:bg-primary hover:text-white border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                                                    >
                                                        {availableTours.filter(t => t.title.toLowerCase().includes(tourSearch.toLowerCase())).every(t => formData.tourIds?.includes(t.id))
                                                            ? "Deselect All"
                                                            : "Select All"}
                                                    </button>
                                                )}
                                            </div>

                                            {toursLoading ? (
                                                <div className="py-20 flex flex-col items-center">
                                                    <Loader2 className="animate-spin text-primary mb-2" size={32} />
                                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Scanning inventory...</p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {availableTours
                                                        .filter(t => t.title.toLowerCase().includes(tourSearch.toLowerCase()))
                                                        .map(tour => {
                                                            const isSelected = formData.tourIds?.includes(tour.id);
                                                            return (
                                                                <button
                                                                    key={tour.id}
                                                                    onClick={() => toggleTourSelection(tour.id)}
                                                                    className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all text-left ${isSelected ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                                                                >
                                                                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                                                        <img src={tour.thumbnailUrl} className="w-full h-full object-cover" alt="" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="font-black text-sm text-gray-900 truncate">{tour.title}</p>
                                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tour.durationDays}D{tour.durationNights}N • {tour.placeName}</p>
                                                                    </div>
                                                                    {isSelected ? (
                                                                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center shrink-0">
                                                                            <Check size={14} />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="w-6 h-6 border-2 border-gray-100 rounded-full shrink-0" />
                                                                    )}
                                                                </button>
                                                            );
                                                        })
                                                    }
                                                    {availableTours.length === 0 && (
                                                        <div className="col-span-full py-10 bg-gray-50 rounded-3xl text-center border-2 border-dashed border-gray-200">
                                                            <Package className="mx-auto text-gray-300 mb-2" size={32} />
                                                            <p className="font-bold text-gray-400">No tours found.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {role === "COMPANY" && formData.tourIds?.length === 0 && (
                                            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3 text-amber-700">
                                                <Info size={20} className="shrink-0" />
                                                <p className="text-xs font-bold leading-relaxed">
                                                    Please select at least one tour. Campaigns from providers must be linked to specific offerings.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-8 border-t border-gray-100 flex gap-4 bg-gray-50/30">
                                {step === 2 && (
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-widest bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all"
                                    >
                                        Go Back
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        if (step === 1) setStep(2);
                                        else handleSubmit();
                                    }}
                                    disabled={loading || (step === 2 && role === "COMPANY" && formData.tourIds?.length === 0)}
                                    className="flex-[2] py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-widest bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            {step === 1 ? "Next Step" : (mode === "EDIT" ? "Save Changes" : "Launch Campaign")}
                                            <ChevronRight size={18} />
                                        </>
                                    )}
                                </button>
                            </div>

                            {errors.server && (
                                <div className="px-8 pb-4">
                                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold text-center border border-red-100">
                                        {errors.server}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </motion.div>

            </div>
        </AnimatePresence>
    );
};

export default PromotionModal;
