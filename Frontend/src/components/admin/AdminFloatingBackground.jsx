import React from 'react';

const AdminFloatingBackground = () => {
  // Minimalist backdrop: zero noisy orbs, clean subtle surface
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-slate-50/60" aria-hidden="true" />
  );
};

export default AdminFloatingBackground;
