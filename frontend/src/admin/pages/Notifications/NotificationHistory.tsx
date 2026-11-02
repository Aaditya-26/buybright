/**
 * BuyBright Admin — Notification History Page.
 * Dedicated page for viewing, filtering, and managing broadcasted customer announcements and alerts.
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { SearchBar } from '../../components/SearchBar';
import { Select, Button } from '../../components/Form';
import { Pagination } from '../../components/Pagination/Pagination';
import {
  getNotificationHistory,
  saveNotificationHistory,
  AnnouncementNotification,
} from '../../data/settingsData';
import { useToast } from '../../../context/ToastContext';
import { exportTableToCSV } from '../../utils/exportCsv';
import { exportTableToPDF } from '../../utils/exportPdf';

export const NotificationHistory: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<AnnouncementNotification[]>(() => getNotificationHistory());

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [audienceFilter, setAudienceFilter] = useState('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filtered Items
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q) ||
        item.targetAudience.toLowerCase().includes(q);

      const matchPriority = priorityFilter === 'All' || item.priority === priorityFilter;
      const matchAudience = audienceFilter === 'All' || item.targetAudience === audienceFilter;

      return matchSearch && matchPriority && matchAudience;
    });
  }, [notifications, searchQuery, priorityFilter, audienceFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredNotifications.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredNotifications.slice(start, start + pageSize);
  }, [filteredNotifications, currentPage, pageSize]);

  // Metrics
  const metrics = useMemo(() => {
    const total = notifications.length;
    const totalRecipients = notifications.reduce((acc, i) => acc + i.recipientCount, 0);
    const promotionalCount = notifications.filter((i) => i.priority === 'Promotional').length;
    const urgentCount = notifications.filter((i) => i.priority === 'Urgent').length;

    return { total, totalRecipients, promotionalCount, urgentCount };
  }, [notifications]);

  // Delete notification
  const handleDelete = (item: AnnouncementNotification) => {
    if (window.confirm(`Are you sure you want to remove notification "${item.title}" from history?`)) {
      const updated = notifications.filter((i) => i.id !== item.id);
      setNotifications(updated);
      saveNotificationHistory(updated);
      showToast(`Removed notification "${item.title}".`, 'success');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    exportTableToCSV({
      filename: `presto_notification_history_${Date.now()}`,
      headers: ['Announcement Title', 'Message', 'Target Audience', 'Priority', 'Recipients', 'Sent Date', 'Status'],
      rows: filteredNotifications.map((i) => [
        i.title,
        i.message,
        i.targetAudience,
        i.priority,
        i.recipientCount,
        i.sentAt,
        i.status,
      ]),
    });
    showToast('Notification history exported as CSV', 'success');
  };

  // Export PDF
  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'BuyBright — Broadcast Notification History Register',
      subtitle: `Total Broadcast Records: ${filteredNotifications.length}`,
      headers: ['Title', 'Audience', 'Priority', 'Recipients', 'Sent Date', 'Status'],
      rows: filteredNotifications.map((i) => [
        i.title,
        i.targetAudience,
        i.priority,
        i.recipientCount.toLocaleString('en-IN'),
        i.sentAt,
        i.status,
      ]),
    });
    showToast('Notification history exported as PDF', 'success');
  };

  return (
    <AdminLayout
      title="Notification History"
      subtitle="View, track delivery reach, and manage all past broadcasted announcements"
    >
      {/* ── KPI Stat Cards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div className="admin-card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#f0fdfa',
              color: '#0d9488',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
            }}
          >
            <i className="fa-solid fa-bullhorn" />
          </div>
          <div>
            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Total Announcements
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{metrics.total}</div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
            }}
          >
            <i className="fa-solid fa-users" />
          </div>
          <div>
            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Total Impressions
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2563eb' }}>
              {metrics.totalRecipients.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
            }}
          >
            <i className="fa-solid fa-tags" />
          </div>
          <div>
            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Promotional Campaigns
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#d97706' }}>{metrics.promotionalCount}</div>
          </div>
        </div>

        <div className="admin-card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#fef2f2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
            }}
          >
            <i className="fa-solid fa-circle-exclamation" />
          </div>
          <div>
            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Urgent Operational Alerts
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444' }}>{metrics.urgentCount}</div>
          </div>
        </div>
      </div>

      {/* ── Toolbar: Search, Filters & Action Buttons ── */}
      <div className="admin-card notification-history-toolbar">
        <div className="toolbar-filters-left" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
          <div className="search-bar-wrap">
            <SearchBar
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                setCurrentPage(1);
              }}
              placeholder="Search announcement title, message or audience..."
              width="320px"
            />
          </div>

          <div className="filter-select-wrap" style={{ width: '160px', marginBottom: 0 }}>
            <Select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              options={[
                { value: 'All', label: 'All Priorities' },
                { value: 'Promotional', label: 'Promotional' },
                { value: 'General', label: 'General' },
                { value: 'Urgent', label: 'Urgent' },
              ]}
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            />
          </div>

          <div className="filter-select-wrap" style={{ width: '170px', marginBottom: 0 }}>
            <Select
              value={audienceFilter}
              onChange={(e) => {
                setAudienceFilter(e.target.value);
                setCurrentPage(1);
              }}
              options={[
                { value: 'All', label: 'All Audiences' },
                { value: 'All Customers', label: 'All Customers' },
                { value: 'Verified Clinics', label: 'Verified Clinics' },
                { value: 'Wholesalers', label: 'Wholesalers' },
              ]}
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            />
          </div>

          <div className="filter-select-wrap" style={{ width: '130px', marginBottom: 0 }}>
            <Select
              value={String(pageSize)}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              options={[
                { value: '5', label: '5 per page' },
                { value: '10', label: '10 per page' },
                { value: '20', label: '20 per page' },
              ]}
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        <div className="toolbar-actions-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button variant="outline" size="md" icon="fa-solid fa-file-csv" onClick={handleExportCSV}>
            CSV
          </Button>
          <Button variant="outline" size="md" icon="fa-solid fa-file-pdf" onClick={handleExportPDF}>
            PDF
          </Button>
          <Button
            variant="primary"
            size="md"
            icon="fa-solid fa-paper-plane"
            onClick={() => navigate('/admin/settings/send-notification')}
          >
            Send New Notification
          </Button>
        </div>
      </div>

      {/* ── Table ── */}
      <div
        className="admin-card"
        style={{
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
        }}
      >
        <div className="admin-table-responsive" style={{ margin: 0 }}>
          <table className="admin-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ minWidth: '260px' }}>Announcement</th>
                <th style={{ minWidth: '160px' }}>Target Audience</th>
                <th style={{ textAlign: 'center', minWidth: '110px' }}>Priority</th>
                <th style={{ minWidth: '120px' }}>Recipients</th>
                <th style={{ minWidth: '160px' }}>Sent Date &amp; Time</th>
                <th style={{ textAlign: 'center', minWidth: '100px' }}>Status</th>
                <th style={{ textAlign: 'right', minWidth: '80px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                    <i className="fa-solid fa-bullhorn" style={{ fontSize: '2rem', marginBottom: '10px', display: 'block', color: '#cbd5e1' }} />
                    <div style={{ fontWeight: 600, fontSize: '0.94rem', color: '#334155' }}>No announcements found</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                      Click "Send New Announcement" to broadcast updates to your clinic customers.
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>{item.title}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '3px', lineHeight: 1.35 }}>
                        {item.message}
                      </div>
                      {item.actionUrl && (
                        <span style={{ display: 'inline-block', fontSize: '0.72rem', color: '#0d9488', marginTop: '4px', fontWeight: 600 }}>
                          <i className="fa-solid fa-link" style={{ marginRight: '4px' }} />
                          {item.actionUrl}
                        </span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>{item.targetAudience}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: item.priority === 'Urgent' ? '#fef2f2' : item.priority === 'Promotional' ? '#fef3c7' : '#f0fdfa',
                          color: item.priority === 'Urgent' ? '#ef4444' : item.priority === 'Promotional' ? '#d97706' : '#0d9488',
                          border: `1px solid ${item.priority === 'Urgent' ? '#fecaca' : item.priority === 'Promotional' ? '#fde68a' : '#ccfbf1'}`,
                        }}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                        {item.recipientCount.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.sentAt}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="admin-badge badge-success">{item.status}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="btn-icon"
                        title="Delete record"
                        style={{ color: '#ef4444' }}
                      >
                        <i className="fa-solid fa-trash" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredNotifications.length}
          onPageChange={(p) => setCurrentPage(p)}
        />
      </div>
    </AdminLayout>
  );
};

export default NotificationHistory;
