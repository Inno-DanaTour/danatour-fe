import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownOption {
    id: number | string;
    name: string;
}

interface DropdownProps {
    label: string;
    options: DropdownOption[];
    value: number | string | "";
    onChange: (value: string | number) => void;
    icon: React.ReactNode;
    placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
    label,
    options,
    value,
    onChange,
    icon,
    placeholder = "Select an option"
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.id === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="space-y-2 w-full" ref={containerRef}>
            <label className="text-sm font-black uppercase tracking-widest text-gray-400">{label}</label>
            <div className="relative">
                {/* Trigger Button */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center gap-4 bg-gray-50 border-2 transition-all p-4 rounded-2xl group ${isOpen
                        ? 'border-primary bg-white ring-4 ring-primary/10 shadow-lg'
                        : 'border-transparent hover:bg-gray-100'
                        }`}
                >
                    <div className={`transition-transform duration-300 ${isOpen ? 'scale-110 text-primary' : 'text-gray-400'}`}>
                        {icon}
                    </div>

                    <span className={`flex-1 text-left font-bold text-base ${!selectedOption ? 'text-gray-400' : 'text-gray-900'}`}>
                        {selectedOption ? selectedOption.name : placeholder}
                    </span>

                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: "anticipate" }}
                        className="text-gray-400"
                    >
                        <ChevronDown size={20} />
                    </motion.div>
                </button>

                {/* Options Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 5, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute z-[100] w-full mt-2 bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[2rem] shadow-2xl shadow-black/10 overflow-hidden py-3"
                        >
                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar px-2 space-y-1">
                                {options.length === 0 ? (
                                    <div className="p-4 text-center text-gray-400 font-medium">No options available</div>
                                ) : (
                                    options.map((option) => (
                                        <button
                                            key={option.id}
                                            type="button"
                                            onClick={() => {
                                                onChange(option.id);
                                                setIsOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between p-4 rounded-xl transition-all group ${value === option.id
                                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                                : 'hover:bg-primary/10 hover:text-primary text-gray-600'
                                                }`}
                                        >
                                            <span className="font-bold">{option.name}</span>
                                            {value === option.id && (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                    <Check size={18} strokeWidth={3} />
                                                </motion.div>
                                            )}
                                        </button>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Dropdown;
