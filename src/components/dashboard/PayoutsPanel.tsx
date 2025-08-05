import React, { useState, useEffect } from "react";
import { DollarSign, Calendar, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, TrendingUp } from "react-feather";
import "./PayoutsPanel.css";

interface Payout {
  id: number;
  payoutId: string;
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'failed' | 'processing';
  date: string;
  description: string;
  bankDetails: string;
  transactionId?: string;
}

const mockPayouts: Payout[] = [
  {
    id: 1,
    payoutId: "PAY-2024-001",
    amount: 5000,
    method: "Bank Transfer",
    status: "completed",
    date: "2024-01-15",
    description: "Referral Bonus Payout",
    bankDetails: "HDFC Bank - ****1234",
    transactionId: "TXN-789456123"
  },
  {
    id: 2,
    payoutId: "PAY-2024-002",
    amount: 3200,
    method: "UPI",
    status: "pending",
    date: "2024-01-14",
    description: "Reward Points Redemption",
    bankDetails: "UPI ID: user@upi",
    transactionId: "TXN-789456124"
  },
  {
    id: 3,
    payoutId: "PAY-2024-003",
    amount: 1800,
    method: "Bank Transfer",
    status: "processing",
    date: "2024-01-13",
    description: "Commission Payout",
    bankDetails: "SBI Bank - ****5678",
    transactionId: "TXN-789456125"
  },
  {
    id: 4,
    payoutId: "PAY-2024-004",
    amount: 4200,
    method: "UPI",
    status: "failed",
    date: "2024-01-12",
    description: "Referral Bonus Payout",
    bankDetails: "UPI ID: user@upi",
    transactionId: "TXN-789456126"
  },
  {
    id: 5,
    payoutId: "PAY-2024-005",
    amount: 2500,
    method: "Bank Transfer",
    status: "completed",
    date: "2024-01-11",
    description: "Level Achievement Bonus",
    bankDetails: "ICICI Bank - ****9012",
    transactionId: "TXN-789456127"
  },
  {
    id: 6,
    payoutId: "PAY-2024-006",
    amount: 1500,
    method: "UPI",
    status: "pending",
    date: "2024-01-10",
    description: "Weekly Bonus Payout",
    bankDetails: "UPI ID: user@upi",
    transactionId: "TXN-789456128"
  },
  {
    id: 7,
    payoutId: "PAY-2024-007",
    amount: 3800,
    method: "Bank Transfer",
    status: "completed",
    date: "2024-01-09",
    description: "Referral Network Bonus",
    bankDetails: "Axis Bank - ****3456",
    transactionId: "TXN-789456129"
  },
  {
    id: 8,
    payoutId: "PAY-2024-008",
    amount: 2100,
    method: "UPI",
    status: "processing",
    date: "2024-01-08",
    description: "Special Campaign Reward",
    bankDetails: "UPI ID: user@upi",
    transactionId: "TXN-789456130"
  }
];

export default function PayoutsPanel() {
  const [payouts, setPayouts] = useState<Payout[]>(mockPayouts);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // Filter payouts based on status
  const filteredPayouts = payouts.filter(payout => 
    filterStatus === "all" || payout.status === filterStatus
  );
  
  const currentPayouts = filteredPayouts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayouts.length / itemsPerPage);

  // Debug logging
  console.log('PayoutsPanel Debug:', {
    totalPayouts: payouts.length,
    filteredPayouts: filteredPayouts.length,
    currentPayouts: currentPayouts.length,
    currentPage,
    itemsPerPage,
    indexOfFirstItem,
    indexOfLastItem,
    samplePayout: currentPayouts[0],
    allPayouts: payouts,
    filteredPayoutsData: filteredPayouts
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="status-icon completed" />;
      case 'pending':
        return <Clock size={16} className="status-icon pending" />;
      case 'failed':
        return <XCircle size={16} className="status-icon failed" />;
      case 'processing':
        return <TrendingUp size={16} className="status-icon processing" />;
      default:
        return <Clock size={16} className="status-icon pending" />;
    }
  };

  const getStatusClass = (status: string) => {
    return `status-badge ${status}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Calculate summary statistics
  const totalPayouts = payouts.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const pendingPayouts = payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const processingPayouts = payouts.filter(p => p.status === 'processing').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="payouts-dashboard-panel">
      {/* Header */}
      <div className="payouts-header">
        <div className="payouts-title">
          <DollarSign size={24} />
          <h2>Payout History</h2>
        </div>
        <div className="payouts-summary">
          <div className="summary-card">
            <div className="summary-icon completed">
              <CheckCircle size={20} />
            </div>
            <div className="summary-content">
              <span className="summary-label">Total Received</span>
              <span className="summary-value">{formatAmount(totalPayouts)}</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon pending">
              <Clock size={20} />
            </div>
            <div className="summary-content">
              <span className="summary-label">Pending</span>
              <span className="summary-value">{formatAmount(pendingPayouts)}</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon processing">
              <TrendingUp size={20} />
            </div>
            <div className="summary-content">
              <span className="summary-label">Processing</span>
              <span className="summary-value">{formatAmount(processingPayouts)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="payouts-filters">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            All ({payouts.length})
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
            onClick={() => handleFilterChange('completed')}
          >
            Completed ({payouts.filter(p => p.status === 'completed').length})
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => handleFilterChange('pending')}
          >
            Pending ({payouts.filter(p => p.status === 'pending').length})
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'processing' ? 'active' : ''}`}
            onClick={() => handleFilterChange('processing')}
          >
            Processing ({payouts.filter(p => p.status === 'processing').length})
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'failed' ? 'active' : ''}`}
            onClick={() => handleFilterChange('failed')}
          >
            Failed ({payouts.filter(p => p.status === 'failed').length})
          </button>
        </div>
      </div>

                    {/* Payouts Table */}
       <div className="payouts-table-wrapper">
         <table className="payouts-table">
          <thead>
            <tr>
              <th>Payout ID</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Bank Details</th>
              <th>Status</th>
              <th>Date</th>
              <th>Transaction ID</th>
            </tr>
          </thead>
          <tbody>
                         {currentPayouts && currentPayouts.length > 0 ? (
               currentPayouts.map((payout, index) => (
                 <tr key={payout.id} className={index % 2 === 0 ? 'orders-row-even' : 'orders-row-odd'}>
                  <td className="payout-id">{payout.payoutId || 'N/A'}</td>
                  <td className="description">{payout.description || 'N/A'}</td>
                  <td className="amount">{formatAmount(payout.amount || 0)}</td>
                  <td className="method">{payout.method || 'N/A'}</td>
                  <td className="bank-details">{payout.bankDetails || 'N/A'}</td>
                  <td className="status">
                    <span className={getStatusClass(payout.status || 'pending')}>
                      {getStatusIcon(payout.status || 'pending')}
                      {(payout.status || 'pending').charAt(0).toUpperCase() + (payout.status || 'pending').slice(1)}
                    </span>
                  </td>
                  <td className="date">
                    <div className="date-content">
                      <Calendar size={14} />
                      {formatDate(payout.date || new Date().toISOString())}
                    </div>
                  </td>
                  <td className="transaction-id">{payout.transactionId || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                  No payouts found for the selected filter.
                </td>
              </tr>
            )}
                     </tbody>
         </table>
       </div>
       {(!currentPayouts || currentPayouts.length === 0) && (
         <div className="no-payouts">
           <DollarSign size={48} />
           <p>No payouts found for the selected filter.</p>
         </div>
       )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`page-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button 
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Page Info */}
      {filteredPayouts.length > 0 && (
        <div className="page-info">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredPayouts.length)} of {filteredPayouts.length} payouts
        </div>
      )}
    </div>
  );
} 