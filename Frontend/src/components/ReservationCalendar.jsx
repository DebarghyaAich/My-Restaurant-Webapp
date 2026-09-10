/**
 * ============================================================================
 * 📅 LUXURY RESERVATION CALENDAR PICKER
 * ============================================================================
 * @component ReservationCalendar
 * @description
 * Theme-adaptive interactive calendar widget designed specifically for restaurant
 * dining bookings. Features:
 *  - Month/year navigation with auto-disabled past dates.
 *  - One-click smart date presets: 'Today', 'Tomorrow', 'This Friday', 'This Saturday'.
 *  - Dual-theme styling (Warm Reddish-Orange vs Artisanal Chai Beige).
 *  - Outside-click closing listener and popover slide-down transitions.
 *
 * @param {string} selectedDate - Formatted YYYY-MM-DD date string
 * @param {function} onSelectDate - Callback receiving selected YYYY-MM-DD string
 * @param {Date} minDate - Minimum selectable date threshold (defaults to today)
 * ============================================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const ReservationCalendar = ({ selectedDate, onSelectDate, minDate = new Date() }) => {
  const { isBeige } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse currently selected date or default to today
  const initialDate = selectedDate ? new Date(selectedDate) : new Date();
  const [viewDate, setViewDate] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));

  // Close calendar when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  // Calendar math
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleDateClick = (day) => {
    const dateObj = new Date(currentYear, currentMonth, day);
    const dateStr = dateObj.toISOString().split('T')[0];
    onSelectDate(dateStr);
    setIsOpen(false);
  };

  // Quick preset helper
  const handlePreset = (offsetDays) => {
    const target = new Date();
    target.setDate(target.getDate() + offsetDays);
    const dateStr = target.toISOString().split('T')[0];
    onSelectDate(dateStr);
    setViewDate(new Date(target.getFullYear(), target.getMonth(), 1));
    setIsOpen(false);
  };

  const getFridayOffset = () => {
    const day = today.getDay();
    const diff = (5 - day + 7) % 7;
    return diff === 0 ? 7 : diff;
  };

  const getSaturdayOffset = () => {
    const day = today.getDay();
    const diff = (6 - day + 7) % 7;
    return diff === 0 ? 7 : diff;
  };

  // Format display string
  const formatDisplay = (dateString) => {
    if (!dateString) return 'Select dining date';
    const [y, m, d] = dateString.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className={`block text-xs font-bold mb-1.5 flex items-center justify-between ${
        isBeige ? 'text-stone-700' : 'text-orange-200'
      }`}>
        <span className="flex items-center gap-1.5">
          <CalendarIcon className="w-3.5 h-3.5 text-orange-500" />
          Reservation Date *
        </span>
        {selectedDate && (
          <span className="text-[10px] font-semibold text-orange-400">
            Selected
          </span>
        )}
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all duration-200 border text-left ${
          isBeige
            ? 'bg-stone-50 border-amber-200 text-stone-900 hover:border-orange-400 focus:ring-2 focus:ring-orange-500'
            : 'bg-[#120504] border-orange-950/90 text-white hover:border-orange-600 focus:ring-2 focus:ring-orange-500'
        } ${isOpen ? 'ring-2 ring-orange-500 border-orange-500' : ''}`}
      >
        <div className="flex items-center gap-2.5">
          <CalendarIcon className="w-4 h-4 text-orange-500 shrink-0" />
          <span className={selectedDate ? (isBeige ? 'text-stone-900' : 'text-white') : 'text-stone-400'}>
            {formatDisplay(selectedDate)}
          </span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider transition-all ${
          isBeige ? 'bg-amber-100 text-amber-900' : 'bg-orange-950/80 text-orange-300'
        }`}>
          {isOpen ? 'Close' : 'Choose'}
        </span>
      </button>

      {/* Popover Calendar Grid */}
      <div
        className={`absolute z-50 left-0 right-0 mt-2 p-4 rounded-3xl border shadow-2xl backdrop-blur-xl transition-all duration-250 transform origin-top ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        } ${
          isBeige
            ? 'bg-white/95 border-amber-200 shadow-amber-950/15 text-stone-900'
            : 'bg-[#1a0705]/95 border-orange-800/60 shadow-black/80 text-white'
        }`}
      >
        {/* Quick Date Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 border-b border-orange-500/20 scrollbar-none">
          <button
            type="button"
            onClick={() => handlePreset(0)}
            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-orange-500/15 text-orange-400 hover:bg-orange-500 hover:text-white transition-all whitespace-nowrap"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => handlePreset(1)}
            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-orange-500/15 text-orange-400 hover:bg-orange-500 hover:text-white transition-all whitespace-nowrap"
          >
            Tomorrow
          </button>
          <button
            type="button"
            onClick={() => handlePreset(getFridayOffset())}
            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-orange-500/15 text-orange-400 hover:bg-orange-500 hover:text-white transition-all whitespace-nowrap"
          >
            This Friday
          </button>
          <button
            type="button"
            onClick={() => handlePreset(getSaturdayOffset())}
            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-orange-500/15 text-orange-400 hover:bg-orange-500 hover:text-white transition-all whitespace-nowrap"
          >
            This Saturday
          </button>
        </div>

        {/* Month Navigation Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className={`p-1.5 rounded-xl transition-colors ${
              isBeige ? 'hover:bg-amber-100 text-stone-700' : 'hover:bg-orange-950/80 text-orange-300'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-black tracking-wide">
            {MONTHS[currentMonth]} {currentYear}
          </span>

          <button
            type="button"
            onClick={handleNextMonth}
            className={`p-1.5 rounded-xl transition-colors ${
              isBeige ? 'hover:bg-amber-100 text-stone-700' : 'hover:bg-orange-950/80 text-orange-300'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {DAYS_OF_WEEK.map((d, i) => (
            <span
              key={d}
              className={`text-[10px] font-bold uppercase tracking-wider py-1 ${
                i === 0 || i === 6
                  ? 'text-orange-500 font-extrabold'
                  : isBeige ? 'text-stone-400' : 'text-orange-200/50'
              }`}
            >
              {d}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {/* Leading Empty Cells */}
          {Array.from({ length: firstDayIndex }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-8" />
          ))}

          {/* Month Day Cells */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const thisDate = new Date(currentYear, currentMonth, dayNum);
            thisDate.setHours(0, 0, 0, 0);

            const isPast = thisDate < today;
            const isToday = thisDate.getTime() === today.getTime();

            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isSelected = selectedDate === dateStr;

            return (
              <button
                key={dayNum}
                type="button"
                disabled={isPast}
                onClick={() => handleDateClick(dayNum)}
                className={`h-8 w-8 mx-auto rounded-xl text-xs font-bold flex items-center justify-center transition-all duration-150 relative ${
                  isSelected
                    ? 'bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-500 text-white shadow-lg shadow-orange-500/40 scale-110 z-10'
                    : isPast
                    ? 'opacity-25 cursor-not-allowed text-stone-500'
                    : isToday
                    ? (isBeige
                        ? 'border-2 border-orange-500 text-orange-600 hover:bg-orange-500/20'
                        : 'border-2 border-orange-500 text-orange-400 hover:bg-orange-500/20')
                    : (isBeige
                        ? 'hover:bg-amber-100 text-stone-800'
                        : 'hover:bg-orange-950/60 hover:text-orange-300 text-stone-200')
                }`}
              >
                {dayNum}
                {isToday && !isSelected && (
                  <span className="w-1 h-1 bg-orange-500 rounded-full absolute bottom-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-3 pt-2.5 border-t border-orange-500/20 flex items-center justify-between text-[10px]">
          <span className={`flex items-center gap-1 ${isBeige ? 'text-stone-500' : 'text-orange-200/50'}`}>
            <Sparkles className="w-3 h-3 text-orange-400" />
            Reserve up to 60 days in advance
          </span>
          <span className="text-orange-500 font-bold">Instant Hold</span>
        </div>
      </div>
    </div>
  );
};

export default ReservationCalendar;
