import React, { useState, useEffect, useCallback } from "react";
import { DollarSign, Calendar, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, TrendingUp, Loader } from "react-feather";
import { payoutsApi, apiUtils } from "../../api";
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
  created_at?: string;
  updated_at?: string;
}



export default function PayoutsPanel() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payoutStats, setPayoutStats] = useState({
    totalPayouts: 0,
    totalAmount: 0,
    pendingAmount: 0,
    completedAmount: 0,
    processingAmount: 0,
    failedAmount: 0,
  });

  // Fetch payouts data
  const fetchPayouts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = apiUtils.getToken();
      const userData = apiUtils.getUserData();
      
      console.log('Token:', token ? 'Present' : 'Missing');
      console.log('User data:', userData);
      
      if (!token || !userData) {
        setError('Authentication required');
        return;
      }

      console.log('Fetching payouts for user:', userData.id);
      const response = await payoutsApi.getPayoutsByUserId(userData.id, token);
      
      console.log('Payouts API response:', response);
      
      if (response.statusCode === 200) {
        setPayouts(response.data || []);
        console.log('Payouts set successfully:', response.data);
      } else {
        setError(response.message || 'Failed to fetch payouts');
      }
    } catch (error) {
      console.error('Error fetching payouts:', error);
      setError(`Failed to fetch payouts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch payout stats
  const fetchPayoutStats = useCallback(async () => {
    try {
      const token = apiUtils.getToken();
      const userData = apiUtils.getUserData();
      
      if (!token || !userData) {
        return;
      }

      const response = await payoutsApi.getPayoutStatsByUserId(userData.id, token);
      
      if (response.statusCode === 200) {
        setPayoutStats(response.data || {
          totalPayouts: 0,
          totalAmount: 0,
          pendingAmount: 0,
          completedAmount: 0,
          processingAmount: 0,
          failedAmount: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching payout stats:', error);
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    fetchPayouts();
    fetchPayoutStats();
  }, [fetchPayouts, fetchPayoutStats]);

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

  // Calculate summary statistics from API data
  const totalPayouts = payoutStats.completedAmount;
  const pendingPayouts = payoutStats.pendingAmount;
  const processingPayouts = payoutStats.processingAmount;

  // Show loading state
  if (loading) {
    return (
      <div className="payouts-dashboard-panel">
        <div className="loading-container">
          <Loader size={48} className="loading-spinner" />
          <p>Loading payouts...</p>
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
        <div className="payouts-dashboard-panel">
          <div className="payouts-login-prompt">
            <DollarSign size={48} color="#7c3aed" />
            <h2>Please Login to View Your Payouts</h2>
            <p>Your session has expired. Please login again to continue.</p>
            <a href="/login" className="payouts-login-btn">Login Now</a>
          </div>
        </div>
      );
    }
    return (
      <div className="payouts-dashboard-panel">
        <div className="error-container">
          <XCircle size={48} className="error-icon" />
          <p>{error}</p>
          <button onClick={fetchPayouts} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payouts-dashboard-panel">
      {/* Header */}
      <div className="payouts-header">
        <div className="payouts-title">
          <DollarSign size={24} />
          <h2>Payout History</h2>
          <button onClick={fetchPayouts} className="refresh-button" disabled={loading}>
            <Loader size={16} className={loading ? "loading-spinner" : ""} />
            Refresh
          </button>
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
                      {formatDate(payout.date || payout.created_at || new Date().toISOString())}
                    </div>
                  </td>
                  <td className="transaction-id">{payout.transactionId || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                  {payouts.length === 0 ? 'No payouts found.' : 'No payouts found for the selected filter.'}
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