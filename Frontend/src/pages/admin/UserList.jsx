import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Users, Trash2, CheckCircle2, AlertCircle, Shield, User } from 'lucide-react';

const UserList = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id, name) => {
    if (id === currentUser?.id) {
      setError('You cannot delete your own active administrator account.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user account "${name}"? This action cannot be reversed.`)) {
      return;
    }

    try {
      const res = await api.delete(`/users/${id}`);
      if (res.data.success) {
        setMessage(`User account "${name}" deleted.`);
        setTimeout(() => setMessage(''), 3000);
        fetchUsers();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div>
        <span className="text-xs font-black uppercase tracking-widest text-rose-400">
          User Directory & Access Control
        </span>
        <h1 className="text-3xl font-black text-white tracking-tight mt-1">
          Registered Restaurant Users
        </h1>
        <p className="text-xs text-purple-300/60">
          Monitor customer accounts, view registration dates, and manage active system privileges
        </p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-950/70 border border-emerald-800/80 text-emerald-300 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-950/40">
          <CheckCircle2 className="w-4 h-4" />
          {message}
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-950/70 border border-rose-800/80 text-rose-300 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-rose-950/40">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Users Table matching Slide 4 & 5 */}
      <div className="admin-glass-card rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-purple-300/50 text-xs">
            Loading user accounts...
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-purple-300/60">
            No registered users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-900/40 text-purple-300/60 font-bold uppercase tracking-wider text-[10px] bg-purple-950/40">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-4">Email</th>
                  <th className="py-4 px-4">Role</th>
                  <th className="py-4 px-4">Registration Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/30">
                {users.map((u) => {
                  const uid = u._id || u.id;
                  const isSelf = uid === currentUser?.id;
                  return (
                    <tr key={uid} className="hover:bg-purple-950/30 transition-colors">
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-rose-950/70 text-rose-300 flex items-center justify-center font-bold text-xs uppercase border border-rose-800/60 shadow-inner">
                            {u.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-white flex items-center gap-2">
                              {u.name}
                              {isSelf && (
                                <span className="px-2 py-0.5 rounded-md bg-rose-950/90 text-rose-300 border border-rose-700/80 text-[10px] font-bold">
                                  You
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-purple-200/90 font-mono">
                        {u.email}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                            u.role === 'Admin'
                              ? 'bg-rose-950/90 text-rose-300 border border-rose-700/80'
                              : 'bg-indigo-950/70 text-indigo-300 border border-indigo-800/60'
                          }`}
                        >
                          {u.role === 'Admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                          {u.role}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-purple-300/60">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-6 text-right">
                        {isSelf ? (
                          <span className="text-[11px] text-purple-400/70 italic">Active Session</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(uid, u.name)}
                            className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/60 rounded-lg transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default UserList;
