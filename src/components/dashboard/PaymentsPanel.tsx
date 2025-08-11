import React, { useState, useEffect, useCallback } from "react";
import { CreditCard, Calendar, DollarSign, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Loader } from "react-feather";
import { paymentsApi, apiUtils } from "../../api";
import "./PaymentsPanel.css";

interface Payment {
  id: number;
  userId: number;
  orderId: string;
  paymentId?: string;
  amount: string;
  currency: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  receipt?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
    mobileNumber: string;
    referral_code: string;
  };
}

interface PaymentStats {
  totalPayments: number;
  totalAmount: number;
  pendingAmount: number;
  paidAmount: number;
  failedAmount: number;
  refundedAmount: number;
}

// Mock data removed - will use real API data

export default function PaymentsPanel() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStats, setPaymentStats] = useState<PaymentStats>({
    totalPayments: 0,
    totalAmount: 0,
    pendingAmount: 0,
    paidAmount: 0,
    failedAmount: 0,
    refundedAmount: 0,
  });

  // Fetch payments data
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = apiUtils.getToken();
      const userData = apiUtils.getUserData();
      
      if (!token || !userData) {
        setError('Authentication required');
        return;
      }

      const response = await paymentsApi.getPaymentsByUserId(userData.id, token);
      
      if (response.statusCode === 200) {
        setPayments(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch payments');
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError(`Failed to fetch payments: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch payment stats
  const fetchPaymentStats = useCallback(async () => {
    try {
      const token = apiUtils.getToken();
      const userData = apiUtils.getUserData();
      
      if (!token || !userData) {
        return;
      }

      const response = await paymentsApi.getPaymentStatsByUserId(userData.id, token);
      
      if (response.statusCode === 200) {
        setPaymentStats(response.data || {
          totalPayments: 0,
          totalAmount: 0,
          pendingAmount: 0,
          paidAmount: 0,
          failedAmount: 0,
          refundedAmount: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching payment stats:', error);
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    fetchPayments();
    fetchPaymentStats();
  }, [fetchPayments, fetchPaymentStats]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // Filter payments based on status
  const filteredPayments = payments.filter(payment => 
    filterStatus === "all" || payment.status === filterStatus
  );
  
  const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  // Debug logging
  console.log('PaymentsPanel Debug:', {
    totalPayments: payments.length,
    filteredPayments: filteredPayments.length,
    currentPayments: currentPayments.length,
    currentPage,
    itemsPerPage,
    indexOfFirstItem,
    indexOfLastItem,
    samplePayment: currentPayments[0],
    allPayments: payments,
    filteredPaymentsData: filteredPayments
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle size={16} className="status-icon completed" />;
      case 'PENDING':
        return <Clock size={16} className="status-icon pending" />;
      case 'FAILED':
        return <XCircle size={16} className="status-icon failed" />;
      case 'REFUNDED':
        return <DollarSign size={16} className="status-icon refunded" />;
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

  // Show loading state
  if (loading) {
    return (
      <div className="payments-dashboard-panel">
        <div className="loading-container">
          <Loader size={48} className="loading-spinner" />
          <p>Loading payments...</p>
        </div>
      </div>
    );
  }

  // Show error state with session/auth handling
  if (error) {
    const lowerError = error.toLowerCase();
    if (
      lowerError.includes('token') ||
      lowerError.includes('expired') ||
      lowerError.includes('login') ||
      lowerError.includes('session') ||
      lowerError.includes('authentication required')
    ) {
      return (
        <div className="payments-dashboard-panel">
          <div className="payments-login-prompt">
            <CreditCard size={48} color="#7c3aed" />
            <h2>Please Login to View Your Payments</h2>
            <p>Your session has expired. Please login again to continue.</p>
            <a href="/login" className="payments-login-btn">Login Now</a>
          </div>
        </div>
      );
    }
    return (
      <div className="payments-dashboard-panel">
        <div className="error-container">
          <XCircle size={48} className="error-icon" />
          <p>{error}</p>
          <button onClick={fetchPayments} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payments-dashboard-panel">
      {/* Header */}
      <div className="payments-header">
        <div className="payments-title">
          <CreditCard size={24} />
          <h2>Payment History</h2>
          <button onClick={fetchPayments} className="refresh-button" disabled={loading}>
            <Loader size={16} className={loading ? "loading-spinner" : ""} />
            Refresh
          </button>
        </div>
        <div className="payments-summary">
          <div className="summary-card">
            <div className="summary-icon completed">
              <CheckCircle size={20} />
            </div>
            <div className="summary-content">
              <span className="summary-label">Total Paid</span>
              <span className="summary-value">{formatAmount(paymentStats.paidAmount)}</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon pending">
              <Clock size={20} />
            </div>
            <div className="summary-content">
              <span className="summary-label">Pending</span>
              <span className="summary-value">{formatAmount(paymentStats.pendingAmount)}</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon failed">
              <XCircle size={20} />
            </div>
            <div className="summary-content">
              <span className="summary-label">Failed</span>
              <span className="summary-value">{formatAmount(paymentStats.failedAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="payments-filters">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            All ({payments.length})
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'PAID' ? 'active' : ''}`}
            onClick={() => handleFilterChange('PAID')}
          >
            Paid ({payments.filter(p => p.status === 'PAID').length})
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'PENDING' ? 'active' : ''}`}
            onClick={() => handleFilterChange('PENDING')}
          >
            Pending ({payments.filter(p => p.status === 'PENDING').length})
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'FAILED' ? 'active' : ''}`}
            onClick={() => handleFilterChange('FAILED')}
          >
            Failed ({payments.filter(p => p.status === 'FAILED').length})
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'REFUNDED' ? 'active' : ''}`}
            onClick={() => handleFilterChange('REFUNDED')}
          >
            Refunded ({payments.filter(p => p.status === 'REFUNDED').length})
          </button>
        </div>
      </div>

             {/* Payments Table */}
       <div className="payments-table-wrapper">
         <table className="payments-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Status</th>
              <th>Date</th>
              <th>Payment ID</th>
            </tr>
          </thead>
          <tbody>
                         {currentPayments && currentPayments.length > 0 ? (
               currentPayments.map((payment, index) => (
                 <tr key={payment.id} className={index % 2 === 0 ? 'orders-row-even' : 'orders-row-odd'}>
                  <td className="order-id">{payment.orderId || 'N/A'}</td>
                  <td className="amount">{formatAmount(parseFloat(payment.amount) || 0)}</td>
                  <td className="currency">{payment.currency || 'INR'}</td>
                  <td className="status">
                    <span className={getStatusClass(payment.status || 'PENDING')}>
                      {getStatusIcon(payment.status || 'PENDING')}
                      {(payment.status || 'PENDING').charAt(0).toUpperCase() + (payment.status || 'PENDING').slice(1)}
                    </span>
                  </td>
                  <td className="date">
                    <div className="date-content">
                      <Calendar size={14} />
                      {formatDate(payment.createdAt || new Date().toISOString())}
                    </div>
                  </td>
                  <td className="payment-id">{payment.paymentId || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                  No payments found for the selected filter.
                </td>
              </tr>
            )}
                     </tbody>
         </table>
       </div>
       {currentPayments.length === 0 && (
         <div className="no-payments">
           <CreditCard size={48} />
           <p>No payments found for the selected filter.</p>
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
      {filteredPayments.length > 0 && (
        <div className="page-info">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredPayments.length)} of {filteredPayments.length} payments
        </div>
      )}
    </div>
  );
} 