import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Calendar, 
  Clock, 
  Users, 
  Phone, 
  Mail, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  UtensilsCrossed, 
  Compass, 
  Sparkles,
  AlertCircle,
  Trash2
} from 'lucide-react';

const STATUS_OPTIONS = ['Confirmed', 'Seated', 'Completed', 'Cancelled'];

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reservations');
      if (res.data.success) {
        setReservations(res.data.reservations || []);
      }
    } catch (err) {
      console.error('Failed to load reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleStatusChange = async (resvId, newStatus) => {
    try {
      const res = await api.put(`/reservations/${resvId}/status`, { status: newStatus });
      if (res.data.success) {
        setUpdateMsg(`Reservation updated to "${newStatus}"`);
        setTimeout(() => setUpdateMsg(''), 2500);
        fetchReservations();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (resvId, refCode) => {
    if (!window.confirm(`Are you sure you want to cancel and remove reservation ${refCode}?`)) {
      return;
    }
    try {
      const res = await api.delete(`/reservations/${resvId}`);
      if (res.data.success) {
        setUpdateMsg(`Reservation ${refCode} removed`);
        setTimeout(() => setUpdateMsg(''), 2500);
        fetchReservations();
      }
    } catch (err) {
      console.error('Failed to delete reservation:', err);
    }
  };

  const filteredReservations = reservations.filter((r) => {
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    if (dateFilter && r.date !== dateFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchRef = r.referenceCode?.toLowerCase().includes(q);
      const matchName = r.customerName?.toLowerCase().includes(q);
      const matchEmail = r.email?.toLowerCase().includes(q);
      const matchPhone = r.phone?.toLowerCase().includes(q);
      if (!matchRef && !matchName && !matchEmail && !matchPhone) return false;
    }
    return true;
  });

  // Calculate Metrics
  const totalBookings = reservations.length;
  const totalTables = reservations
    .filter(r => r.status !== 'Cancelled')
    .reduce((sum, r) => sum + (Number(r.tables) || 1), 0);
  const confirmedCount = reservations.filter(r => r.status === 'Confirmed').length;
  const seatedCount = reservations.filter(r => r.status === 'Seated').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Seated':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Completed':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <UtensilsCrossed className="w-6 h-6 text-orange-600" />
            Table Reservations
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Monitor who booked tables, party sizes, seating zones, and dining schedule
          </p>
        </div>

        <button
          type="button"
          onClick={fetchReservations}
          className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          Refresh Bookings
        </button>
      </div>

      {updateMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {updateMsg}
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block mb-1">Total Bookings</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{totalBookings}</span>
            <span className="text-[10px] text-slate-400 font-bold">All Time</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block mb-1">Active Tables Booked</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-orange-600">{totalTables}</span>
            <span className="text-[10px] text-orange-600/80 font-bold">Tables Held</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block mb-1">Confirmed Upcoming</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-600">{confirmedCount}</span>
            <span className="text-[10px] text-emerald-600/80 font-bold">Confirmed</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block mb-1">Currently Seated</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-blue-600">{seatedCount}</span>
            <span className="text-[10px] text-blue-600/80 font-bold">In Dining Room</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, or code..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Date Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-700 focus:outline-none"
            />
            {dateFilter && (
              <button 
                type="button" 
                onClick={() => setDateFilter('')} 
                className="text-[10px] text-slate-400 hover:text-slate-700 font-bold ml-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {['All', ...STATUS_OPTIONS].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  statusFilter === status
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reservations Table / Cards */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredReservations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-2">
          <UtensilsCrossed className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No Reservations Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {search || dateFilter || statusFilter !== 'All'
              ? 'No table bookings match your current search or filter criteria.'
              : 'No table reservations have been booked yet.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Who Booked (Customer)</th>
                  <th className="py-3 px-4">Tables & Guests</th>
                  <th className="py-3 px-4">Dining Schedule</th>
                  <th className="py-3 px-4">Seating Ambience</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReservations.map((r) => (
                  <tr key={r._id || r.id || r.referenceCode} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Booking Ref */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200/60 inline-block text-[11px]">
                        {r.referenceCode}
                      </span>
                    </td>

                    {/* Who Booked */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <strong className="block font-semibold text-slate-900 text-xs">
                          {r.customerName}
                        </strong>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[150px]">{r.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{r.phone}</span>
                        </div>
                      </div>
                    </td>

                    {/* Tables & Guests */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <UtensilsCrossed className="w-3 h-3 text-amber-600" />
                          {r.tables || 1} Table{(r.tables || 1) > 1 ? 's' : ''}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Users className="w-3 h-3 text-slate-400" />
                          <span>{r.guests}</span>
                        </div>
                      </div>
                    </td>

                    {/* Dining Schedule */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-medium text-slate-800">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{r.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{r.time}</span>
                        </div>
                      </div>
                    </td>

                    {/* Seating Ambience & Notes */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 font-medium text-slate-700">
                          <Compass className="w-3.5 h-3.5 text-slate-400" />
                          <span>{r.seatingArea || 'Main Dining Hall'}</span>
                        </div>
                        {r.message && (
                          <p className="text-[11px] text-slate-400 italic truncate max-w-[180px]" title={r.message}>
                            "{r.message}"
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={r.status || 'Confirmed'}
                        onChange={(e) => handleStatusChange(r._id || r.id || r.referenceCode, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${getStatusBadge(r.status)}`}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} className="bg-white text-slate-900 font-normal">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(r._id || r.id || r.referenceCode, r.referenceCode)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors inline-flex items-center"
                        title="Delete Reservation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReservationList;
