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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: '#001837' }}>Welcome back to AIM IAC CMS</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Here is an overview of website operations and recent customer activity.</p>
        </div>
        <button
          className="btn btn-secondary btn-sm"
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Manage Services</h4>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Edit descriptions, update images, and publish new offerings.</p>
          </div>
          <Link to="/admin/services" className="btn btn-primary btn-sm">
            <span>View</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Review Enquiries</h4>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Follow up on quote requests and customer inquiries.</p>
          </div>
          <Link to="/admin/enquiries" className="btn btn-primary btn-sm">
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
          <table className="admin-table">
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
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    Loading recent enquiries from database...
                  </td>
                </tr>
              ) : recentEnquiries.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    No customer enquiries received yet.
                  </td>
                </tr>
              ) : (
                recentEnquiries.map((enq) => (
                  <tr key={enq.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#001837' }}>{enq.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{enq.email}</div>
                    </td>
                    <td>{enq.phone}</td>
                    <td>
                      <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                        {enq.service_name || 'General Inquiry'}
                      </span>
                    </td>
                    <td>{getStatusBadge(enq.status)}</td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {new Date(enq.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td style={{ textAlign: 'right' }}>
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

