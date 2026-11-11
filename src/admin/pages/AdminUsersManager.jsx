import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Key,
  ShieldCheck,
  Shield,
  UserCheck,
  UserX,
  X,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

const emptyUserForm = {
  id: null,
  name: '',
  email: '',
  role: 'admin',
  password: '',
  password_confirmation: '',
  is_active: true,
};

const AdminUsersManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [formState, setFormState] = useState(emptyUserForm);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Password Modal
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordUser, setPasswordUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { user: currentAdmin } = useAuth();
  const { showToast } = useToast();

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/v1/admin-users');
      if (res.data && res.data.data) {
        setUsers(res.data.data);
      } else if (Array.isArray(res.data)) {
        setUsers(res.data);
      }
    } catch (err) {
      console.warn('Fetch admin users error:', err.message);
      showToast('Could not load admin accounts from API.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
  });

  const openAddModal = () => {
    setFormState(emptyUserForm);
    setFormErrors({});
    setUserModalOpen(true);
  };

  const openEditModal = (targetUser) => {
    setFormState({
      id: targetUser.id,
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
      password: '',
      password_confirmation: '',
      is_active: !!targetUser.is_active,
    });
    setFormErrors({});
    setUserModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setFormErrors({});

    const errors = {};
    if (!formState.name.trim()) errors.name = 'Full name is required';
    if (!formState.email.trim()) errors.email = 'Email is required';
    if (!formState.id && !formState.password) errors.password = 'Initial password is required';
    if (!formState.id && formState.password && formState.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    try {
      if (formState.id) {
        // Update
        const res = await api.put(`/api/v1/admin-users/${formState.id}`, {
          name: formState.name,
          email: formState.email,
          role: formState.role,
          is_active: formState.is_active,
        });
        showToast('Admin user updated successfully');
        setUsers((prev) => prev.map((u) => (u.id === formState.id ? res.data.data : u)));
      } else {
        // Create
        const res = await api.post('/api/v1/admin-users', formState);
        showToast('New administrator added');
        setUsers((prev) => [res.data.data, ...prev]);
      }
      setUserModalOpen(false);
    } catch (err) {
      if (err.response?.status === 422 && err.response.data?.errors) {
        setFormErrors(err.response.data.errors);
      } else {
        showToast(err.response?.data?.message || 'Error saving user', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (targetUser) => {
    if (targetUser.id === currentAdmin?.id) {
      showToast('Security restriction: You cannot deactivate your own account.', 'error');
      return;
    }

    const nextStatus = !targetUser.is_active;
    try {
      await api.patch(`/api/v1/admin-users/${targetUser.id}/toggle-status`, {
        is_active: nextStatus,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, is_active: nextStatus } : u))
      );
      showToast(`User is now ${nextStatus ? 'Active' : 'Deactivated'}`);
    } catch {
      showToast('Failed to change user status', 'error');
    }
  };

  const openPasswordModal = (targetUser) => {
    setPasswordUser(targetUser);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordModalOpen(true);
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      showToast('Password must be at least 8 characters long.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    setSavingPassword(true);
    try {
      await api.patch(`/api/v1/admin-users/${passwordUser.id}/password`, {
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      showToast('Password updated securely in MySQL');
      setPasswordModalOpen(false);
      setPasswordUser(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update password', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  const confirmDelete = (targetUser) => {
    if (targetUser.id === currentAdmin?.id) {
      showToast('Security restriction: You cannot delete your own account.', 'error');
      return;
    }
    setUserToDelete(targetUser);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/api/v1/admin-users/${userToDelete.id}`);
      showToast('Admin user deleted successfully');
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete user', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="table-toolbar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search admins by name, email or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={16} />
          <span>Add Admin User</span>
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Authorized Administrators ({filteredUsers.length})</h3>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Protected with role-based access control and Sanctum sessions
          </span>
        </div>

        <div className="table-responsive">
          <table className="admin-table mobile-card-table">
            <thead>
              <tr>
                <th>Administrator</th>
                <th>Access Role</th>
                <th>Account Status</th>
                <th>Last Login</th>
                <th>Created At</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="table-state-row">
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                    Loading administrator accounts...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr className="table-state-row">
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                    No admin accounts found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isSelf = u.id === currentAdmin?.id;
                  return (
                    <tr key={u.id}>
                      <td className="cell-main">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className="user-avatar" style={{ width: '34px', height: '34px', fontSize: '0.85rem' }}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 600, color: '#001837' }}>
                              {u.name} {isSelf && <span style={{ fontSize: '0.72rem', color: '#31a49c', fontWeight: 700 }}>(You)</span>}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b', overflowWrap: 'anywhere' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td data-label="Role">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Shield size={14} color="#31a49c" />
                          <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>
                            {u.role.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td data-label="Status">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(u)}
                          disabled={isSelf}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: isSelf ? 'not-allowed' : 'pointer',
                            padding: 0,
                            opacity: isSelf ? 0.8 : 1
                          }}
                          title={isSelf ? 'Cannot deactivate yourself' : 'Toggle account active/inactive'}
                        >
                          {u.is_active ? (
                            <span className="badge badge-success">
                              <UserCheck size={12} /> Active
                            </span>
                          ) : (
                            <span className="badge badge-danger">
                              <UserX size={12} /> Inactive
                            </span>
                          )}
                        </button>
                      </td>
                      <td data-label="Last Login" style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {u.last_login_at
                          ? new Date(u.last_login_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Never'}
                      </td>
                      <td data-label="Created" style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {new Date(u.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="cell-actions" style={{ textAlign: 'right' }}>
                        <div className="cell-action-group">
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => openPasswordModal(u)}
                            title="Reset Password"
                          >
                            <Key size={13} />
                            <span className="mobile-btn-label">Reset</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => openEditModal(u)}
                            title="Edit User"
                          >
                            <Edit2 size={13} />
                            <span className="mobile-btn-label">Edit</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => confirmDelete(u)}
                            disabled={isSelf}
                            title={isSelf ? 'Cannot delete your own account' : 'Delete Account'}
                            style={{ opacity: isSelf ? 0.4 : 1, cursor: isSelf ? 'not-allowed' : 'pointer' }}
                          >
                            <Trash2 size={13} />
                            <span className="mobile-btn-label">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Admin User Modal */}
      {userModalOpen && (
        <div className="modal-overlay" onClick={() => setUserModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{formState.id ? 'Edit Admin User' : 'Add New Admin User'}</h3>
              <button
                onClick={() => setUserModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveUser}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="e.g. Tariq Al-Mansoor"
                    required
                  />
                  {formErrors.name && <div className="form-error">{formErrors.name}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="tariq@aimiac.com"
                    required
                  />
                  {formErrors.email && <div className="form-error">{formErrors.email}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Administrative Role *</label>
                  <select
                    className="form-control"
                    value={formState.role}
                    onChange={(e) => setFormState({ ...formState, role: e.target.value })}
                  >
                    <option value="super_admin">Super Admin (Full system control)</option>
                    <option value="admin">Admin (Manage content & enquiries)</option>
                    <option value="editor">Editor (Edit services & content)</option>
                  </select>
                </div>

                {!formState.id && (
                  <div className="form-group">
                    <label className="form-label">Initial Password (Min 8 chars) *</label>
                    <input
                      type="password"
                      className="form-control"
                      value={formState.password}
                      onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                      placeholder="••••••••••••"
                      required
                    />
                    {formErrors.password && <div className="form-error">{formErrors.password}</div>}
                  </div>
                )}

                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formState.is_active}
                      onChange={(e) => setFormState({ ...formState, is_active: e.target.checked })}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Active account</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setUserModalOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : formState.id ? 'Save Changes' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {passwordModalOpen && (
        <div className="modal-overlay" onClick={() => setPasswordModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Reset Admin Password</h3>
              <button
                onClick={() => setPasswordModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSavePassword}>
              <div className="modal-body">
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
                  Setting a new password for <strong>{passwordUser?.name}</strong> ({passwordUser?.email}).
                </p>

                <div className="form-group">
                  <label className="form-label">New Password (Min 8 characters) *</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password *</label>
                  <input
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setPasswordModalOpen(false)}
                  disabled={savingPassword}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={savingPassword}>
                  {savingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Administrator"
        message={`Are you sure you want to permanently revoke administrator access and delete "${userToDelete?.name}"?`}
        confirmText="Delete Admin"
        isDanger={true}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setUserToDelete(null);
        }}
      />
    </div>
  );
};

export default AdminUsersManager;

