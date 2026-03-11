import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Twitter,
  ArrowRight,
  Globe,
  ShieldCheck,
} from "lucide-react";

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleNavClick = (href: string) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(href);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#020617] text-gray-300 pt-20 pb-10 border-t border-white/5 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-30" />
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-sea/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("/");
              }}
              className="flex items-center gap-2 group w-fit"
            >
              <div className="w-20 h-20">
                <img
                  src="/logo.png"
                  alt="DanaTour Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold text-white tracking-tight font-display">
                Dana<span className="text-accent">Tour</span>
              </span>
            </a>
            <p className="text-gray-400 leading-relaxed text-sm">
              Discover the hidden gems of Da Nang with our curated tours. We
              provide premium travel experiences that create lifelong memories.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all"
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { label: "Home", href: "/" },
                { label: "Da Nang Explore", href: "/explore" },
                { label: "Find Tour", href: "/tours" },
                { label: "About Us", href: "/about" },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="flex items-center gap-2 hover:text-accent transition-colors group cursor-pointer"
                  >
                    <ArrowRight
                      size={14}
                      className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all"
                    />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-primary" />
                </div>
                <span className="text-sm">
                  123 Dragon Bridge St, Hai Chau, Da Nang, Vietnam
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <Phone size={16} className="text-primary" />
                </div>
                <span className="text-sm">+84 (236) 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <Mail size={16} className="text-primary" />
                </div>
                <span className="text-sm">hello@danatour.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Trust */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg">Subscribe</h3>
            <p className="text-sm text-gray-400">
              Get the latest travel deals and news.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Your email"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <button className="absolute right-2 top-2 w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-sea transition-colors">
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="flex items-center gap-4 pt-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-green-500" />
                Secure Payments
              </div>
              <div className="flex items-center gap-1">
                <Globe size={14} className="text-blue-500" />
                Global Support
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} DanaTour. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
