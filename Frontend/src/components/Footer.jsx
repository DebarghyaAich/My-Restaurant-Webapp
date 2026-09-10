import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Phone, Mail, MapPin, Clock, Heart } from 'lucide-react';
import AnimatedBrandName from './AnimatedBrandName';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 mt-auto border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <AnimatedBrandName text="Dabba" className="text-2xl font-black text-white" />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Crafting unforgettable culinary memories with fresh organic ingredients, wood-fired flavors, and doorstep express delivery.
            </p>
            <div className="flex items-center gap-2 text-xs text-orange-400 font-semibold bg-orange-950/40 border border-orange-900/50 px-3 py-1.5 rounded-lg w-fit">
              <Clock className="w-4 h-4" />
              Open Daily: 10:00 AM – 11:30 PM
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wide">Quick Navigation</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-orange-400 transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-orange-400 transition-colors">Gourmet Menu</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-orange-400 transition-colors">About Our Chefs</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-400 transition-colors">Table Reservations</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-orange-400 transition-colors">Shopping Cart</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-orange-400 transition-colors">Customer Account</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wide">Menu Categories</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Appetizers & Starters</li>
              <li>Signature Main Courses</li>
              <li>Artisanal Wood-Fired Pizzas</li>
              <li>Handcrafted Desserts</li>
              <li>Refreshing Craft Mocktails</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wide">Contact Us</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>42 Gourmet Boulevard, Culinary District, Metropolis</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span>+1 (800) 827-8924</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span>support@dabba.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 text-center md:flex md:justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Dabba Restaurant System. Built with MERN Stack.</p>
          <p className="flex items-center justify-center gap-1 mt-2 md:mt-0">
            Engineered with <Heart className="w-3.5 h-3.5 text-orange-500 inline fill-orange-500" /> for culinary perfection.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
