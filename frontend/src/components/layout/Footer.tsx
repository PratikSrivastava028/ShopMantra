import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors duration-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/customer" className="group">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                ShopMantra
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Experience the next generation of smart e-commerce. Powered by cognitive AI to locate, compare, and organize your checkout process.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-indigo-400 transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-indigo-400 transition-colors" aria-label="GitHub">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-indigo-400 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/customer/products" className="hover:text-cyan-400 transition-colors">Shop Catalogue</Link></li>
              <li><Link to="/customer/profile" className="hover:text-cyan-400 transition-colors">User Profile</Link></li>
              <li><Link to="/customer" className="hover:text-cyan-400 transition-colors">Home Page</Link></li>
            </ul>
          </div>

          {/* Legal/Support Column */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Legal & Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Security Standards</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Refund Regulations</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Contact ShopMantra</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>100 Innovation Parkway, Suite 500, San Francisco, CA 94107</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+1 (800) ShopMantra</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>support@shopmantra.ai</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ShopMantra Inc. All rights reserved. Created by senior architects for high-fidelity startup evaluation.</p>
        </div>
      </div>
    </footer>
  );
};
