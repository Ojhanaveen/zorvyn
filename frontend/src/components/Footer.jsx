import React from 'react';
import { LayoutDashboard, Code2, Send, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Logo & About */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-display font-bold text-white tracking-tight">
                Finma
              </span>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              A high-performance finance data processing and access control platform designed for modern enterprises. Manage your transactions secure and efficiently.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Features</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Security</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Finma Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-500 hover:text-white transition-colors"><Code2 size={20} /></a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors"><Send size={20} /></a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors"><Globe size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
