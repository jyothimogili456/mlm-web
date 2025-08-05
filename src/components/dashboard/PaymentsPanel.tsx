import React, { useState, useEffect } from "react";
import { CreditCard, Calendar, DollarSign, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight } from "react-feather";
import "./PaymentsPanel.css";

interface Payment {
  id: number;
  orderId: string;
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  date: string;
  description: string;
  transactionId?: string;
}

const mockPayments: Payment[] = [
  {
    id: 1,
    orderId: "ORD-2024-001",
    amount: 2500,
    method: "Credit Card",
    status: "completed",
    date: "2024-01-15",
    description: "Premium Membership Plan",
    transactionId: "TXN-123456789"
  },
  {
    id: 2,
    orderId: "ORD-2024-002",
    amount: 1500,
    method: "UPI",
    status: "pending",
    date: "2024-01-14",
    description: "Product Purchase - Electronics",
    transactionId: "TXN-123456790"
  },
  {
    id: 3,
    orderId: "ORD-2024-003",
    amount: 800,
    method: "Net Banking",
    status: "completed",
    date: "2024-01-13",
    description: "Referral Bonus Payment",
    transactionId: "TXN-123456791"
  },
  {
    id: 4,
    orderId: "ORD-2024-004",
    amount: 3200,
    method: "Credit Card",
    status: "failed",
    date: "2024-01-12",
    description: "Premium Package Upgrade",
    transactionId: "TXN-123456792"
  },
  {
    id: 5,
    orderId: "ORD-2024-005",
    amount: 1200,
    method: "UPI",
    status: "refunded",
    date: "2024-01-11",
    description: "Product Return Refund",
    transactionId: "TXN-123456793"
  },
  {
    id: 6,
    orderId: "ORD-2024-006",
    amount: 950,
    method: "Net Banking",
    status: "completed",
    date: "2024-01-10",
    description: "Service Fee Payment",
    transactionId: "TXN-123456794"
  },
  {
    id: 7,
    orderId: "ORD-2024-007",
    amount: 1800,
    method: "Credit Card",
    status: "pending",
    date: "2024-01-09",
    description: "Referral Program Fee",
    transactionId: "TXN-123456795"
  },
  {
    id: 8,
    orderId: "ORD-2024-008",
    amount: 2100,
    method: "UPI",
    status: "completed",
    date: "2024-01-08",
    description: "Premium Features Access",
    transactionId: "TXN-123456796"
  }
];

export default function PaymentsPanel() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loading, setLoading] = useState(false);

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
      case 'completed':
        return <CheckCircle size={16} className="status-icon completed" />;
      case 'pending':
        return <Clock size={16} className="status-icon pending" />;
      case 'failed':
        return <XCircle size={16} className="status-icon failed" />;
      case 'refunded':
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

  return (
    <div className="payments-dashboard-panel">
      {/* Header */}
      <div className="payments-header">
        <div className="payments-title">
          <CreditCard size={24} />
          <h2>Payment History</h2>
        </div>
        <div className="payments-summary">
          <div className="summary-card">
            <div className="summary-icon completed">
              <CheckCircle size={20} />
            </div>
            <div className="summary-content">
              <span className="summary-label">Total Paid</span>
              <span className="summary-value">₹8,450</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon pending">
              <Clock size={20} />
            </div>
            <div className="summary-content">
              <span className="summary-label">Pending</span>
              <span className="summary-value">₹3,300</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon failed">
              <XCircle size={20} />
            </div>
            <div className="summary-content">
              <span className="summary-label">Failed</span>
              <span className="summary-value">₹3,200</span>
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
            className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
            onClick={() => handleFilterChange('completed')}
          >
            Completed ({payments.filter(p => p.status === 'completed').length})
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => handleFilterChange('pending')}
          >
            Pending ({payments.filter(p => p.status === 'pending').length})
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'failed' ? 'active' : ''}`}
            onClick={() => handleFilterChange('failed')}
          >
            Failed ({payments.filter(p => p.status === 'failed').length})
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'refunded' ? 'active' : ''}`}
            onClick={() => handleFilterChange('refunded')}
          >
            Refunded ({payments.filter(p => p.status === 'refunded').length})
          </button>
        </div>
      </div>

             {/* Payments Table */}
       <div className="payments-table-wrapper">
         <table className="payments-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Date</th>
              <th>Transaction ID</th>
            </tr>
          </thead>
          <tbody>
                         {currentPayments && currentPayments.length > 0 ? (
               currentPayments.map((payment, index) => (
                 <tr key={payment.id} className={index % 2 === 0 ? 'orders-row-even' : 'orders-row-odd'}>
                  <td className="order-id">{payment.orderId || 'N/A'}</td>
                  <td className="description">{payment.description || 'N/A'}</td>
                  <td className="amount">{formatAmount(payment.amount || 0)}</td>
                  <td className="method">{payment.method || 'N/A'}</td>
                  <td className="status">
                    <span className={getStatusClass(payment.status || 'pending')}>
                      {getStatusIcon(payment.status || 'pending')}
                      {(payment.status || 'pending').charAt(0).toUpperCase() + (payment.status || 'pending').slice(1)}
                    </span>
                  </td>
                  <td className="date">
                    <div className="date-content">
                      <Calendar size={14} />
                      {formatDate(payment.date || new Date().toISOString())}
                    </div>
                  </td>
                  <td className="transaction-id">{payment.transactionId || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
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