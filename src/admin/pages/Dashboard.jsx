import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Inbox,
  Clock,
  Users,
  ArrowRight,
  TrendingUp,
  Eye,
  RefreshCw,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../components/Toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_services: 0,
    total_enquiries: 0,
    pending_enquiries: 0,
    total_admins: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { showToast } = useToast();

  const fetchDashboardData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await api.get('/api/v1/dashboard/stats');
      if (res.data) {
        setStats(res.data.stats || {});
        setRecentEnquiries(res.data.recent_enquiries || []);
      }
      if (isManual) showToast('Dashboard statistics refreshed');
    } catch (err) {
      console.warn('Dashboard fetch error:', err.message);
      showToast('Could not load live statistics. Ensure backend is running.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
      {/* Top Banner & Refresh */}
      <div className="dashboard-welcome">
        <div className="dashboard-welcome-text">
          <h2>Welcome back to AIM IAC CMS</h2>
          <p>Here is an overview of website operations and recent customer activity.</p>
        </div>
        <button
          className="btn btn-secondary btn-sm dashboard-refresh-btn"
          onClick={() => fetchDashboardData(true)}
          disabled={refreshing || loading}
          title="Refresh live data"
        >
          <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
          <span>{refreshing ? 'Updating...' : 'Refresh'}</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-teal">
          <div className="stat-info">
            <span className="stat-label">Total Services</span>
            <span className="stat-value">{loading ? '...' : stats.total_services}</span>
            <span className="stat-desc">Published on website</span>
          </div>
          <div className="stat-icon-wrapper">
            <Layers size={26} />
          </div>
        </div>

        <div className="stat-card stat-navy">
          <div className="stat-info">
            <span className="stat-label">Total Enquiries</span>
            <span className="stat-value">{loading ? '...' : stats.total_enquiries}</span>
            <span className="stat-desc">Submitted via contact</span>
          </div>
          <div className="stat-icon-wrapper">
            <Inbox size={26} />
          </div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-info">
            <span className="stat-label">Pending Enquiries</span>
            <span className="stat-value">{loading ? '...' : stats.pending_enquiries}</span>
            <span className="stat-desc">Awaiting staff response</span>
          </div>
          <div className="stat-icon-wrapper">
            <Clock size={26} />
          </div>
        </div>

        <div className="stat-card stat-blue">
          <div className="stat-info">
            <span className="stat-label">Admin Users</span>
            <span className="stat-value">{loading ? '...' : stats.total_admins}</span>
            <span className="stat-desc">Authorized accounts</span>
          </div>
          <div className="stat-icon-wrapper">
            <Users size={26} />
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="quick-actions-grid">
        <div className="card quick-action-card">
          <div className="quick-action-info">
            <h4>Manage Services</h4>
            <p>Edit descriptions, update images, and publish new offerings.</p>
          </div>
          <Link to="/admin/services" className="btn btn-primary btn-sm quick-action-btn">
            <span>View</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="card quick-action-card">
          <div className="quick-action-info">
            <h4>Review Enquiries</h4>
            <p>Follow up on quote requests and customer inquiries.</p>
          </div>
          <Link to="/admin/enquiries" className="btn btn-primary btn-sm quick-action-btn">
            <span>View</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Recent Enquiries Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Customer Enquiries</h3>
          <Link to="/admin/enquiries" style={{ fontSize: '0.85rem', color: '#31a49c', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>View All Enquiries</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="table-responsive">
          <table className="admin-table mobile-card-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Phone / WhatsApp</th>
                <th>Service Requested</th>
                <th>Status</th>
                <th>Received Date</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="table-state-row">
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    Loading recent enquiries from database...
                  </td>
                </tr>
              ) : recentEnquiries.length === 0 ? (
                <tr className="table-state-row">
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    No customer enquiries received yet.
                  </td>
                </tr>
              ) : (
                recentEnquiries.map((enq) => (
                  <tr key={enq.id}>
                    <td className="cell-main">
                      <div style={{ fontWeight: 600, color: '#001837' }}>{enq.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', wordBreak: 'break-word' }}>{enq.email}</div>
                    </td>
                    <td data-label="Phone">{enq.phone}</td>
                    <td data-label="Service">
                      <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                        {enq.service_name || 'General Inquiry'}
                      </span>
                    </td>
                    <td data-label="Status">{getStatusBadge(enq.status)}</td>
                    <td data-label="Received" style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {new Date(enq.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="cell-actions" style={{ textAlign: 'right' }}>
                      <Link to="/admin/enquiries" className="btn btn-secondary btn-sm" title="View details in Enquiries module">
                        <Eye size={13} />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

