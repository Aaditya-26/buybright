/**
 * ContactEnquiryList Page.
 * Displays website contact enquiries matching the exact fields from ContactPage.tsx:
 * - First Name & Last Name (firstName, lastName)
 * - Mobile Number (mobileNo)
 * - Email Address (email)
 * - Comment or Message (commentOrMessage)
 * - Consent Checkbox (agreedToContact)
 * - Submission Timestamp (receivedAt)
 * - Workflow Status (status: New | In Progress | Contacted | Resolved)
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { DataTable, type Column } from '../../components/DataTable';
import { SearchBar } from '../../components/SearchBar';
import {
  getContactEnquiries,
  updateContactEnquiryStatus,
   
  toggleStarEnquiry,
} from '../../data/contactData';
import type { ContactEnquiry, EnquiryStatus } from '../../types/contact';
import { useToast } from '../../../context/ToastContext';
import { exportTableToPDF } from '../../utils/exportPdf';
import { exportTableToCSV } from '../../utils/exportCsv';

export const ContactEnquiryList: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>(() => getContactEnquiries());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Detail Modal State
  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactEnquiry | null>(null);
  const [modalStatus, setModalStatus] = useState<EnquiryStatus>('New');
  const [modalNotes, setModalNotes] = useState<string>('');

  
  // Reload data from localStorage
  const reloadData = () => {
    setEnquiries(getContactEnquiries());
  };

  // KPI Metrics Calculation
  const metrics = useMemo(() => {
    const total = enquiries.length;
    const newCount = enquiries.filter((e) => e.status === 'New').length;
    const inProgressCount = enquiries.filter((e) => e.status === 'In Progress').length;
    const resolvedCount = enquiries.filter((e) => e.status === 'Resolved').length;
    return { total, newCount, inProgressCount, resolvedCount };
  }, [enquiries]);

  // Filtered Enquiries (Search across all website fields)
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.firstName.toLowerCase().includes(q) ||
        item.lastName.toLowerCase().includes(q) ||
        `${item.firstName} ${item.lastName}`.toLowerCase().includes(q) ||
        item.mobileNo.includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.commentOrMessage.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [enquiries, searchQuery, statusFilter]);

  // View Modal handlers
  const handleOpenModal = (enquiry: ContactEnquiry) => {
    setSelectedEnquiry(enquiry);
    setModalStatus(enquiry.status);
    setModalNotes(enquiry.notes || '');
  };

  const handleCloseModal = () => {
    setSelectedEnquiry(null);
  };

  const handleSaveModalChanges = () => {
    if (!selectedEnquiry) return;
    updateContactEnquiryStatus(selectedEnquiry.id, modalStatus, modalNotes);
    reloadData();
    showToast(`Inquiry #${selectedEnquiry.srNo} updated successfully!`, 'success');
    handleCloseModal();
  };

  // Priority Star
  const handleToggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isStarred = toggleStarEnquiry(id);
    reloadData();
    showToast(isStarred ? 'Marked inquiry as priority.' : 'Removed priority.', 'info');
  };
 
  // Inline status change
  const handleInlineStatusChange = (id: string, newStatus: EnquiryStatus) => {
    updateContactEnquiryStatus(id, newStatus);
    reloadData();
    showToast(`Status updated to "${newStatus}".`, 'info');
  };

  // Clean phone number for WhatsApp
  const cleanPhone = (phone: string) => {
    const digits = phone.replace(/[^0-9]/g, '');
    return digits.startsWith('91') ? digits : `91${digits}`;
  };

  // Export Table to CSV
  const handleExportCSV = () => {
    exportTableToCSV({
      filename: `contact_enquiries_${new Date().toISOString().slice(0, 10)}.csv`,
      headers: ['Sr.No.', 'First Name', 'Last Name', 'Mobile No.', 'Email', 'Message', 'Consent', 'Date', 'Status'],
      rows: filteredEnquiries.map((e) => [
        e.srNo,
        e.firstName,
        e.lastName,
        `+91 ${e.mobileNo}`,
        e.email,
        e.commentOrMessage,
        e.agreedToContact ? 'Yes' : 'No',
        e.receivedAt,
        e.status,
      ]),
    });
    showToast('Contact enquiries CSV report exported.', 'success');
  };

  // Export Table to PDF
  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'BuyBright - Website Contact Enquiries',
      subtitle: `Customer enquiries register (${filteredEnquiries.length} records)`,
      headers: ['Sr.No.', 'First Name', 'Last Name', 'Mobile No.', 'Email', 'Message Excerpt', 'Date', 'Status'],
      rows: filteredEnquiries.map((e) => [
        e.srNo,
        e.firstName,
        e.lastName,
        `+91 ${e.mobileNo}`,
        e.email,
        e.commentOrMessage.substring(0, 35) + '...',
        e.receivedAt,
        e.status,
      ]),
    });
    showToast('Exporting inquiries report to PDF preview...', 'info');
  };

  // Table Columns (Exact website fields)
  const columns: Column<ContactEnquiry>[] = [
    {
      key: 'action',
      header: 'Action',
      width: '95px',
      render: (item) => (
        <div className="table-action-btns" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button
            type="button"
            className="btn-icon-action"
            title="View Full Details"
            onClick={() => handleOpenModal(item)}
            aria-label={`View ${item.firstName} ${item.lastName}`}
            style={{ color: '#0d9488' }}
          >
            <i className="fa-solid fa-eye" />
          </button>

          <a
            href={`https://wa.me/${cleanPhone(item.mobileNo)}?text=Hello%20${encodeURIComponent(
              `${item.firstName} ${item.lastName}`
            )}%2C%20thank%20you%20for%20contacting%20BuyBright.`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-icon-action"
            title="Chat on WhatsApp"
            style={{ color: '#25D366' }}
            onClick={(e) => e.stopPropagation()}
          >
            <i className="fa-brands fa-whatsapp" />
          </a>

          
        </div>
      ),
    },
    {
      key: 'srNo',
      header: 'Sr.',
      width: '55px',
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            type="button"
            onClick={(e) => handleToggleStar(item.id, e)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              color: item.isStarred ? '#eab308' : '#cbd5e1',
              fontSize: '0.85rem',
            }}
            title={item.isStarred ? 'Priority Inquiry' : 'Mark as Priority'}
          >
            <i className={item.isStarred ? 'fa-solid fa-star' : 'fa-regular fa-star'} />
          </button>
          <span>{item.srNo}</span>
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Name (First & Last)',
      render: (item) => (
        <div>
          <strong style={{ color: '#1e293b' }}>
            {item.firstName} {item.lastName}
          </strong>
          {item.agreedToContact && (
            <div style={{ fontSize: '0.7rem', color: '#10b981', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <i className="fa-solid fa-check-circle" style={{ fontSize: '0.68rem' }} />
              <span>Consent Verified</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'mobileNo',
      header: 'Mobile No.',
      width: '140px',
      render: (item) => (
        <div>
          <a
            href={`tel:+91${item.mobileNo}`}
            style={{ color: '#334155', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}
          >
            <i className="fa-solid fa-phone" style={{ fontSize: '0.72rem', color: '#10b981' }} />
            <span>+91 {item.mobileNo}</span>
          </a>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (item) => (
        <div>
          <a
            href={`mailto:${item.email}`}
            style={{ color: '#0284c7', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <i className="fa-solid fa-envelope" style={{ fontSize: '0.72rem' }} />
            <span>{item.email}</span>
          </a>
        </div>
      ),
    },
    {
      key: 'commentOrMessage',
      header: 'Comment or Message',
      render: (item) => (
        <div
          style={{
            maxWidth: '300px',
            fontSize: '0.82rem',
            color: '#475569',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.4',
          }}
          title={item.commentOrMessage}
        >
          {item.commentOrMessage}
        </div>
      ),
    },
    {
      key: 'receivedAt',
      header: 'Date & Time',
      width: '135px',
      render: (item) => (
        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
          <i className="fa-regular fa-clock" style={{ marginRight: '4px', fontSize: '0.72rem' }} />
          <span>{item.receivedAt}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '130px',
      render: (item) => {
        let badgeColor = '#64748b';
        let badgeBg = '#f1f5f9';
        if (item.status === 'New') {
          badgeColor = '#b91c1c';
          badgeBg = '#fee2e2';
        } else if (item.status === 'In Progress') {
          badgeColor = '#b45309';
          badgeBg = '#fef3c7';
        } else if (item.status === 'Contacted') {
          badgeColor = '#0369a1';
          badgeBg = '#e0f2fe';
        } else if (item.status === 'Resolved') {
          badgeColor = '#047857';
          badgeBg = '#d1fae5';
        }

        return (
          <select
            value={item.status}
            onChange={(e) => handleInlineStatusChange(item.id, e.target.value as EnquiryStatus)}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid rgba(0,0,0,0.1)',
              backgroundColor: badgeBg,
              color: badgeColor,
            }}
          >
            <option value="New">● New</option>
            <option value="In Progress">● In Progress</option>
            <option value="Contacted">● Contacted</option>
            <option value="Resolved">● Resolved</option>
          </select>
        );
      },
    },
  ];

  return (
    <AdminLayout
      title="Contact Enquiries"
      subtitle="View, track, and respond to customer enquiries submitted directly via the website contact form"
    >
      <div style={{ width: '100%' }}>
        {/* Top KPI Metrics Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '22px',
          }}
        >
          {/* Total */}
          <div
            className="admin-card"
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderLeft: '4px solid #0d9488',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                Total Enquiries
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                {metrics.total}
              </div>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: '#ccfbf1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0d9488',
                fontSize: '1.1rem',
              }}
            >
              <i className="fa-solid fa-inbox" />
            </div>
          </div>

          {/* New / Unread */}
          <div
            className="admin-card"
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderLeft: '4px solid #ef4444',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                New / Unread
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ef4444', marginTop: '2px' }}>
                {metrics.newCount}
              </div>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef4444',
                fontSize: '1.1rem',
              }}
            >
              <i className="fa-solid fa-bell" />
            </div>
          </div>

          {/* In Progress */}
          <div
            className="admin-card"
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderLeft: '4px solid #f59e0b',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                In Progress
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#f59e0b', marginTop: '2px' }}>
                {metrics.inProgressCount}
              </div>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d97706',
                fontSize: '1.1rem',
              }}
            >
              <i className="fa-solid fa-hourglass-half" />
            </div>
          </div>

          {/* Resolved */}
          <div
            className="admin-card"
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderLeft: '4px solid #10b981',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                Resolved
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#10b981', marginTop: '2px' }}>
                {metrics.resolvedCount}
              </div>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: '#d1fae5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981',
                fontSize: '1.1rem',
              }}
            >
              <i className="fa-solid fa-circle-check" />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>
            Enquiries Register ({filteredEnquiries.length})
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="btn-admin-secondary"
              onClick={reloadData}
              title="Refresh list"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <i className="fa-solid fa-rotate" />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              className="btn-export-csv"
              onClick={handleExportCSV}
              title="Export Contact Enquiries to CSV"
            >
              <i className="fa-solid fa-file-csv" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              className="btn-export-pdf"
              onClick={handleExportPDF}
              title="Export Contact Enquiries to PDF"
            >
              <i className="fa-solid fa-file-pdf" />
              <span>Export PDF</span>
            </button>

            <button
              type="button"
              className="btn-admin-primary"
              onClick={() => navigate('/admin/contact/customizer')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <i className="fa-solid fa-sliders" />
              <span>Contact Customizer</span>
            </button>
          </div>
        </div>

        {/* Filters Card */}
        <div
          className="admin-card"
          style={{
            padding: '16px 20px',
            marginBottom: '16px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ flex: '1 1 320px', minWidth: '240px' }}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by first name, last name, mobile, email or message..."
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label htmlFor="status-filter" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>
              Status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input-select"
              style={{ padding: '6px 12px', fontSize: '0.84rem', minWidth: '130px' }}
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Contacted">Contacted</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={filteredEnquiries}
          keyExtractor={(item) => item.id}
          emptyMessage="No contact enquiries match your search criteria."
        />

        {/* Details Modal */}
        {selectedEnquiry && (
          <div
            className="admin-modal-overlay"
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(4px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
            onClick={handleCloseModal}
          >
            <div
              className="admin-modal-card"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                maxWidth: '620px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
                padding: '28px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '14px',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Inquiry #{selectedEnquiry.srNo} • {selectedEnquiry.receivedAt}
                  </span>
                  <h3 style={{ margin: '4px 0 0', fontSize: '1.25rem', color: '#0f172a', fontWeight: 700 }}>
                    {selectedEnquiry.firstName} {selectedEnquiry.lastName}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.3rem',
                    color: '#94a3b8',
                    cursor: 'pointer',
                  }}
                  title="Close modal"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>

              {/* Exact Website Fields Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px',
                  background: '#f8fafc',
                  padding: '14px',
                  borderRadius: '8px',
                  marginBottom: '18px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                    First Name
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>
                    {selectedEnquiry.firstName}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                    Last Name
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>
                    {selectedEnquiry.lastName}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                    Mobile No.
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>
                    <a href={`tel:+91${selectedEnquiry.mobileNo}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      +91 {selectedEnquiry.mobileNo}
                    </a>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                    Email
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0284c7', marginTop: '2px' }}>
                    <a href={`mailto:${selectedEnquiry.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {selectedEnquiry.email}
                    </a>
                  </div>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                    Consent Checkbox
                  </div>
                  <div style={{ fontSize: '0.84rem', color: selectedEnquiry.agreedToContact ? '#10b981' : '#ef4444', fontWeight: 600, marginTop: '2px' }}>
                    {selectedEnquiry.agreedToContact
                      ? '✓ Agreed to be contacted regarding inquiry'
                      : '✗ Consent not granted'}
                  </div>
                </div>
              </div>

              {/* Fast Follow-up Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  marginBottom: '20px',
                  padding: '10px 14px',
                  background: '#f0fdfa',
                  border: '1px solid #ccfbf1',
                  borderRadius: '8px',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f766e' }}>Direct Reply:</span>
                <a
                  href={`https://wa.me/${cleanPhone(selectedEnquiry.mobileNo)}?text=Hello%20${encodeURIComponent(
                    `${selectedEnquiry.firstName} ${selectedEnquiry.lastName}`
                  )}%2C%20BuyBright%20support%20desk%20is%20reaching%20out%20regarding%20your%20inquiry.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-admin-secondary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#15803d',
                    borderColor: '#86efac',
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                    padding: '4px 10px',
                  }}
                >
                  <i className="fa-brands fa-whatsapp" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`mailto:${selectedEnquiry.email}?subject=BuyBright%20Inquiry%20Response`}
                  className="btn-admin-secondary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#0369a1',
                    borderColor: '#7dd3fc',
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                    padding: '4px 10px',
                  }}
                >
                  <i className="fa-solid fa-paper-plane" />
                  <span>Send Email</span>
                </a>

                <a
                  href={`tel:+91${selectedEnquiry.mobileNo}`}
                  className="btn-admin-secondary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8rem',
                    padding: '4px 10px',
                    textDecoration: 'none',
                  }}
                >
                  <i className="fa-solid fa-phone" />
                  <span>Call</span>
                </a>
              </div>

              {/* Comment or Message Content */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                  Comment or Message
                </div>
                <div
                  style={{
                    background: '#f8fafc',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    color: '#334155',
                    lineHeight: '1.6',
                    marginTop: '4px',
                    whiteSpace: 'pre-wrap',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  {selectedEnquiry.commentOrMessage}
                </div>
              </div>

              {/* Status & Admin Notes */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <div style={{ marginBottom: '14px' }}>
                  <label htmlFor="modal-status-select" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Workflow Status
                  </label>
                  <select
                    id="modal-status-select"
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value as EnquiryStatus)}
                    className="form-input-select"
                    style={{ width: '100%', padding: '8px 12px' }}
                  >
                    <option value="New">New (Unattended)</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="modal-notes-textarea" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Internal Admin Notes
                  </label>
                  <textarea
                    id="modal-notes-textarea"
                    value={modalNotes}
                    onChange={(e) => setModalNotes(e.target.value)}
                    rows={3}
                    placeholder="Enter internal notes for reference..."
                    className="form-input-textarea"
                    style={{ width: '100%', padding: '10px' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" className="btn-admin-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="button" className="btn-admin-primary" onClick={handleSaveModalChanges}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        
      </div>
    </AdminLayout>
  );
};

export default ContactEnquiryList;
