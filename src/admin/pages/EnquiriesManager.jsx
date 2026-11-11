import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  CheckCircle,
  Clock,
  Send,
  X,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

const EnquiriesManager = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Detail Modal
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { showToast } = useToast();

  const fetchEnquiries = async () => {
    try {
      const res = await api.get('/api/v1/enquiries');
      if (res.data && res.data.data) {
        setEnquiries(res.data.data);
      } else if (Array.isArray(res.data)) {
        setEnquiries(res.data);
      }
    } catch (err) {
      console.warn('Fetch enquiries error:', err.message);
      showToast('Could not load enquiries from API.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      const matchesQuery =
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.phone.includes(searchQuery) ||
        (e.service_name && e.service_name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || e.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [enquiries, searchQuery, statusFilter]);

  const handleStatusChange = async (enquiryId, newStatus) => {
    setUpdatingStatus(true);
    try {
      await api.patch(`/api/v1/enquiries/${enquiryId}/status`, { status: newStatus });
      setEnquiries((prev) =>
        prev.map((item) => (item.id === enquiryId ? { ...item, status: newStatus } : item))
      );
      if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
        setSelectedEnquiry((prev) => ({ ...prev, status: newStatus }));
      }
      showToast(`Status updated to "${newStatus}"`);
    } catch {
      showToast('Failed to update enquiry status', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const confirmDelete = (enquiry) => {
    setEnquiryToDelete(enquiry);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!enquiryToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/api/v1/enquiries/${enquiryToDelete.id}`);
      showToast('Enquiry record deleted');
      setEnquiries((prev) => prev.filter((e) => e.id !== enquiryToDelete.id));
      if (selectedEnquiry?.id === enquiryToDelete.id) {
        setSelectedEnquiry(null);
      }
      setDeleteModalOpen(false);
      setEnquiryToDelete(null);
    } catch {
      showToast('Failed to delete enquiry', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge badge-warning">Pending Review</span>;
      case 'contacted':
        return <span className="badge badge-info">Contacted</span>;
      case 'completed':
        return <span className="badge badge-success">Completed</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div>
      <div className="table-toolbar">
        <div className="toolbar-controls">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search enquiries by name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-select-wrap">
            <Filter size={16} color="#64748b" />
            <select
              className="form-control filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="contacted">Contacted</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Customer Enquiries ({filteredEnquiries.length})</h3>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Direct submissions from public contact & quote forms
          </span>
        </div>

        <div className="table-responsive">
          <table className="admin-table mobile-card-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone / WhatsApp</th>
                <th>Requested Service</th>
                <th>Message Preview</th>
                <th>Status</th>
                <th>Submitted On</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="table-state-row">
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                    Loading enquiries from database...
                  </td>
                </tr>
              ) : filteredEnquiries.length === 0 ? (
                <tr className="table-state-row">
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                    No customer enquiries found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enq) => (
                  <tr key={enq.id}>
                    <td className="cell-main">
                      <div style={{ fontWeight: 600, color: '#001837' }}>{enq.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', overflowWrap: 'anywhere' }}>{enq.email}</div>
                    </td>
                    <td data-label="Phone">
                      <a href={`tel:${enq.phone}`} style={{ color: '#001837', fontWeight: 500 }}>
                        {enq.phone}
                      </a>
                    </td>
                    <td data-label="Service">
                      <span style={{ fontWeight: 500 }}>
                        {enq.service_name || 'General Inquiry'}
                      </span>
                    </td>
                    <td className="cell-block" data-label="Message" style={{ maxWidth: '280px', fontSize: '0.82rem', color: '#475569' }}>
                      <p style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {enq.message}
                      </p>
                    </td>
                    <td data-label="Status">{getStatusBadge(enq.status)}</td>
                    <td data-label="Submitted" style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {new Date(enq.created_at).toLocaleDateString('en-US', {
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
                          onClick={() => setSelectedEnquiry(enq)}
                          title="View Full Details"
                        >
                          <Eye size={13} />
                          <span className="mobile-btn-label">View</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => confirmDelete(enq)}
                          title="Delete Enquiry"
                        >
                          <Trash2 size={13} />
                          <span className="mobile-btn-label">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="modal-overlay" onClick={() => setSelectedEnquiry(null)}>
          <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Enquiry Details</h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>ID #{selectedEnquiry.id}</span>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem', border: '1px solid #e2e8f0' }}>
                <div className="admin-form-grid-2">
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Customer Name</span>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#001837' }}>{selectedEnquiry.name}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Current Status</span>
                    <div style={{ marginTop: '0.2rem' }}>{getStatusBadge(selectedEnquiry.status)}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Email Address</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                      <Mail size={14} color="#31a49c" style={{ flexShrink: 0 }} />
                      <a href={`mailto:${selectedEnquiry.email}`} style={{ color: '#31a49c', fontWeight: 500, overflowWrap: 'anywhere' }}>
                        {selectedEnquiry.email}
                      </a>
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Phone / WhatsApp</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                      <Phone size={14} color="#31a49c" />
                      <a href={`tel:${selectedEnquiry.phone}`} style={{ color: '#001837', fontWeight: 600 }}>
                        {selectedEnquiry.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#001837' }}>Service Requested:</span>
                <div style={{ fontSize: '0.95rem', color: '#31a49c', fontWeight: 600, marginTop: '0.2rem' }}>
                  {selectedEnquiry.service_name || 'General Inquiry / Custom Quote'}
                </div>
              </div>

              <div className="form-group">
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#001837' }}>Inquiry Message:</span>
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '1rem',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  color: '#1e293b',
                  marginTop: '0.4rem',
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'anywhere'
                }}>
                  {selectedEnquiry.message}
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#001837', display: 'block', marginBottom: '0.6rem' }}>
                  Update Workflow Status:
                </span>
                <div className="enquiry-status-actions">
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedEnquiry.status === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleStatusChange(selectedEnquiry.id, 'pending')}
                    disabled={updatingStatus}
                  >
                    Pending
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedEnquiry.status === 'contacted' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleStatusChange(selectedEnquiry.id, 'contacted')}
                    disabled={updatingStatus}
                  >
                    Mark as Contacted
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedEnquiry.status === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleStatusChange(selectedEnquiry.id, 'completed')}
                    disabled={updatingStatus}
                  >
                    Mark as Completed
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <a
                href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ marginRight: 'auto' }}
              >
                <Send size={14} />
                <span>Open in WhatsApp</span>
              </a>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedEnquiry(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Enquiry Record"
        message={`Are you sure you want to delete the enquiry from "${enquiryToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Record"
        isDanger={true}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setEnquiryToDelete(null);
        }}
      />
    </div>
  );
};

export default EnquiriesManager;

