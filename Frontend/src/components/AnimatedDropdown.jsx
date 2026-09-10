/**
 * ============================================================================
 * ✨ SPRING-ANIMATED ACCORDION DROPDOWN SELECTOR
 * ============================================================================
 * @component AnimatedDropdown
 * @description
 * Ultra-smooth custom select component replacing native browser selects.
 * Features:
 *  - Springy cubic-bezier menu expansion with micro-backdrop blur.
 *  - Animated rotating chevron and selected option checkmark pop-in.
 *  - Subtitle descriptions and badges for rich option context.
 *  - Full outside-click dismissal support.
 *
 * @param {string} label - Input field title
 * @param {React.Component} icon - Lucide-react icon component
 * @param {Array} options - Array of string values or { value, label, subtext } objects
 * @param {string} value - Currently active value
 * @param {function} onChange - Value update handler
 * ============================================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const AnimatedDropdown = ({
  label,
  icon: Icon,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  badgeText
}) => {
  const { isBeige } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectedOption = options.find((opt) => 
    (typeof opt === 'string' ? opt : opt.value) === value
  );

  const getLabel = (opt) => (typeof opt === 'string' ? opt : opt.label);
  const getValue = (opt) => (typeof opt === 'string' ? opt : opt.value);
  const getSubtext = (opt) => (typeof opt === 'object' ? opt.subtext : null);
  const getBadge = (opt) => (typeof opt === 'object' ? opt.badge : null);
  const getOptIcon = (opt) => (typeof opt === 'object' ? opt.icon : null);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className={`block text-xs font-bold mb-1.5 flex items-center justify-between ${
          isBeige ? 'text-stone-700' : 'text-orange-200'
        }`}>
          <span className="flex items-center gap-1.5">
            {Icon && <Icon className="w-3.5 h-3.5 text-orange-500" />}
            {label}
          </span>
          {badgeText && (
            <span className="text-[10px] font-semibold text-orange-400">
              {badgeText}
            </span>
          )}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all duration-200 border text-left active:scale-[0.99] ${
          isBeige
            ? 'bg-stone-50 border-amber-200 text-stone-900 hover:border-orange-400 focus:ring-2 focus:ring-orange-500'
            : 'bg-[#120504] border-orange-950/90 text-white hover:border-orange-600 focus:ring-2 focus:ring-orange-500'
        } ${isOpen ? 'ring-2 ring-orange-500 border-orange-500' : ''}`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {Icon && <Icon className="w-4 h-4 text-orange-500 shrink-0" />}
          {selectedOption ? (
            <span className="truncate">
              {getLabel(selectedOption)}
            </span>
          ) : (
            <span className="text-stone-400 truncate">{placeholder}</span>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-orange-500 shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute z-50 left-0 right-0 mt-2 p-1.5 rounded-2xl border shadow-2xl backdrop-blur-2xl transition-all duration-200 origin-top max-h-64 overflow-y-auto scrollbar-none ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        } ${
          isBeige
            ? 'bg-white/95 border-amber-200 shadow-amber-950/15 text-stone-900'
            : 'bg-[#180705]/95 border-orange-850/70 shadow-black/80 text-white'
        }`}
      >
        <div className="space-y-1">
          {options.map((opt) => {
            const optVal = getValue(opt);
            const optLabel = getLabel(opt);
            const optSub = getSubtext(opt);
            const optBadge = getBadge(opt);
            const OptIcon = getOptIcon(opt);
            const isSelected = value === optVal;

            return (
              <button
                key={optVal}
                type="button"
                onClick={() => handleSelect(optVal)}
                className={`w-full px-3 py-2 rounded-xl text-xs text-left flex items-center justify-between transition-all duration-150 group active:scale-[0.98] ${
                  isSelected
                    ? isBeige
                      ? 'bg-gradient-to-r from-orange-100 to-amber-50 text-orange-950 font-extrabold border-l-4 border-orange-500 shadow-sm'
                      : 'bg-gradient-to-r from-orange-600/30 via-amber-600/20 to-transparent text-white font-extrabold border-l-4 border-orange-500 shadow-sm shadow-orange-950/40'
                    : isBeige
                    ? 'text-stone-700 hover:bg-amber-100/70 hover:translate-x-1'
                    : 'text-stone-300 hover:bg-orange-950/50 hover:text-white hover:translate-x-1'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {OptIcon && (
                    <OptIcon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-orange-500' : 'text-stone-400 group-hover:text-orange-400'}`} />
                  )}
                  <div className="truncate">
                    <p className="truncate leading-snug">{optLabel}</p>
                    {optSub && (
                      <p className={`text-[10px] font-normal truncate mt-0.5 ${
                        isSelected 
                          ? (isBeige ? 'text-orange-800' : 'text-orange-300/80')
                          : (isBeige ? 'text-stone-500' : 'text-stone-400')
                      }`}>
                        {optSub}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {optBadge && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase tracking-wider">
                      {optBadge}
                    </span>
                  )}
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center scale-100 transition-transform duration-150 shadow-sm shadow-orange-500/50">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnimatedDropdown;
