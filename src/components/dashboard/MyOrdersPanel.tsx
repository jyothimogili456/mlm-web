import React, { useState, useEffect } from "react";
import { CheckCircle, Truck, Clock, FileText, Loader } from "react-feather";
import { apiUtils, productApi } from "../../api";
import { jsPDF } from "jspdf";
import camelqLogo from "../../assets/camelq logo without background (1).png";
import "./MyOrdersPanel.css";

interface Order {
  id: string;
  product: string;
  date: string;
  status: string;
  amount: number;
}

// Remove hardcoded orders - will be fetched from API
const statusOptions = ["All", "Delivered", "Shipped", "Processing"];
const dateOptions = ["All", "Last 7 days", "Last 30 days", "2024-05", "2024-04"];
const ORDERS_PER_PAGE = 3;

function getStatusIcon(status: string) {
  if (status === "Delivered") return <CheckCircle size={18} className="order-status-icon delivered" />;
  if (status === "Shipped") return <Truck size={18} className="order-status-icon shipped" />;
  return <Clock size={18} className="order-status-icon processing" />;
}

export default function MyOrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const filteredOrders = orders.filter(order => {
    const statusMatch = statusFilter === "All" || order.status === statusFilter;
    const dateMatch =
      dateFilter === "All" ||
      (dateFilter === "Last 7 days" && new Date(order.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (dateFilter === "Last 30 days" && new Date(order.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
      (dateFilter.length === 7 && order.date.startsWith(dateFilter));
    return statusMatch && dateMatch;
  });

  // Fetch order history from API
  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userData = apiUtils.getUserData();
        const token = apiUtils.getToken();
        
        if (!userData || !token) {
          setError('Please login to view your orders');
          setLoading(false);
          return;
        }

        const result = await productApi.getOrderHistory(userData.id, token);
        console.log('Order History API Response:', result);
        
        if (result.data) {
          // Transform API data to match our Order interface
          const transformedOrders = result.data.map((order: any) => ({
            id: order.id?.toString() || order.orderId?.toString() || `ORD${Math.random().toString(36).substr(2, 9)}`,
            product: order.productName || order.product || 'Product',
            date: order.orderedAt || order.created_at || order.orderDate || new Date().toISOString().split('T')[0],
            status: order.status || 'Processing',
            amount: order.productPrice ? (order.productPrice * (order.quantity || 1)) : (order.amount || order.totalAmount || 0)
          }));
          
          setOrders(transformedOrders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching order history:', error);
        setError('Failed to load orders. Please try again.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice((page - 1) * ORDERS_PER_PAGE, page * ORDERS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  // Reset to page 1 when filters change
  React.useEffect(() => { setPage(1); }, [statusFilter, dateFilter]);

  const handleDownload = (orderId: string) => {
    setDownloadingId(orderId);
    const order = orders.find(o => o.id === orderId);
    
    setTimeout(() => {
      const doc = new jsPDF();
      
      // Set background color (light beige)
      doc.setFillColor(250, 248, 245);
      doc.rect(0, 0, 210, 297, 'F');
      
      // Header Section
      // Add company logo image
      const img = new Image();
      img.src = camelqLogo;
      img.onload = () => {
        // Add logo image to PDF
        doc.addImage(img, 'PNG', 20, 15, 30, 30);
        
        // Invoice Title
        doc.setFontSize(24);
        doc.setFont("helvetica", 'bold');
        doc.text("INVOICE", 140, 25);
        
        // Invoice Details (right-aligned)
        doc.setFontSize(10);
        doc.setFont("helvetica", 'normal');
        doc.text(`Invoice No. ${order?.id || "12345"}`, 140, 35);
        doc.text(`Date: ${order?.date ? new Date(order.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : "16 June 2025"}`, 140, 40);
        
        // Billed To Section
        doc.setFontSize(12);
        doc.setFont("helvetica", 'bold');
        doc.text("BILLED TO:", 20, 60);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", 'normal');
        doc.text("Customer Name", 20, 70);
        doc.text("+91-98765-43210", 20, 75);
        doc.text("123 Customer Street, City, State 12345", 20, 80);
        
        // Invoice Items Table
        // Table Header
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.1);
        doc.line(20, 100, 190, 100); // Top line
        
        // Column headers
        doc.setFontSize(10);
        doc.setFont("helvetica", 'bold');
        doc.text("Item", 20, 110);
        doc.text("Quantity", 80, 110);
        doc.text("Unit Price", 120, 110);
        doc.text("Total", 160, 110);
        
        doc.line(20, 115, 190, 115); // Bottom line of header
        
        // Table content
        doc.setFont("helvetica", 'normal');
        doc.text(order?.product || "Product Name", 20, 125);
        doc.text("1", 80, 125);
        doc.text(`₹${order?.amount || "0"}`, 120, 125);
        doc.text(`₹${order?.amount || "0"}`, 160, 125);
        
        // Separator line
        doc.line(20, 130, 190, 130);
        
        // Summary Section (right-aligned)
        doc.setFontSize(10);
        doc.setFont("helvetica", 'normal');
        doc.text("Subtotal:", 120, 150);
        doc.text(`₹${order?.amount || "0"}`, 160, 150);
        
        doc.text("Tax (0%):", 120, 155);
        doc.text("₹0", 160, 155);
        
        doc.line(120, 160, 190, 160); // Separator line
        
        doc.setFont("helvetica", 'bold');
        doc.setFontSize(12);
        doc.text("Total:", 120, 170);
        doc.text(`₹${order?.amount || "0"}`, 160, 170);
        
        // Footer Section
        // Left side - Thank you and payment info
        doc.setFontSize(12);
        doc.setFont("helvetica", 'normal');
        doc.text("Thank you!", 20, 220);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", 'bold');
        doc.text("PAYMENT INFORMATION", 20, 230);
        
        doc.setFont("helvetica", 'normal');
        doc.text("camelQ Bank", 20, 240);
        doc.text("Account Name: camelQ Software Solutions", 20, 245);
        doc.text("Account No.: 123-456-7890", 20, 250);
        doc.text("Pay by: 30 days from invoice date", 20, 255);
        
        // Right side - Company info
        doc.setFontSize(12);
        doc.setFont("helvetica", 'normal');
        doc.text("camelQ Software Solutions", 140, 220);
        
        doc.setFontSize(10);
        doc.text("123 Business Street, City, State 12345", 140, 230);
        doc.text("Phone: +91-12345-67890", 140, 235);
        doc.text("Email: info@camelq.com", 140, 240);
        
        doc.save(`invoice-${orderId}.pdf`);
        setDownloadingId(null);
      };
      
      // Fallback if image fails to load
      img.onerror = () => {
        // Use text logo as fallback
        doc.setFontSize(24);
        doc.setFont("helvetica", 'bold');
        doc.text("camelQ", 20, 30);
        
        // Continue with rest of invoice...
        doc.setFontSize(24);
        doc.setFont("helvetica", 'bold');
        doc.text("INVOICE", 140, 25);
        
        // Invoice Details (right-aligned)
        doc.setFontSize(10);
        doc.setFont("helvetica", 'normal');
        doc.text(`Invoice No. ${order?.id || "12345"}`, 140, 35);
        doc.text(`Date: ${order?.date ? new Date(order.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : "16 June 2025"}`, 140, 40);
        
        // Billed To Section
        doc.setFontSize(12);
        doc.setFont("helvetica", 'bold');
        doc.text("BILLED TO:", 20, 60);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", 'normal');
        doc.text("Customer Name", 20, 70);
        doc.text("+91-98765-43210", 20, 75);
        doc.text("123 Customer Street, City, State 12345", 20, 80);
        
        // Invoice Items Table
        // Table Header
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.1);
        doc.line(20, 100, 190, 100); // Top line
        
        // Column headers
        doc.setFontSize(10);
        doc.setFont("helvetica", 'bold');
        doc.text("Item", 20, 110);
        doc.text("Quantity", 80, 110);
        doc.text("Unit Price", 120, 110);
        doc.text("Total", 160, 110);
        
        doc.line(20, 115, 190, 115); // Bottom line of header
        
        // Table content
        doc.setFont("helvetica", 'normal');
        doc.text(order?.product || "Product Name", 20, 125);
        doc.text("1", 80, 125);
        doc.text(`₹${order?.amount || "0"}`, 120, 125);
        doc.text(`₹${order?.amount || "0"}`, 160, 125);
        
        // Separator line
        doc.line(20, 130, 190, 130);
        
        // Summary Section (right-aligned)
        doc.setFontSize(10);
        doc.setFont("helvetica", 'normal');
        doc.text("Subtotal:", 120, 150);
        doc.text(`₹${order?.amount || "0"}`, 160, 150);
        
        doc.text("Tax (0%):", 120, 155);
        doc.text("₹0", 160, 155);
        
        doc.line(120, 160, 190, 160); // Separator line
        
        doc.setFont("helvetica", 'bold');
        doc.setFontSize(12);
        doc.text("Total:", 120, 170);
        doc.text(`₹${order?.amount || "0"}`, 160, 170);
        
        // Footer Section
        // Left side - Thank you and payment info
        doc.setFontSize(12);
        doc.setFont("helvetica", 'normal');
        doc.text("Thank you!", 20, 220);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", 'bold');
        doc.text("PAYMENT INFORMATION", 20, 230);
        
        doc.setFont("helvetica", 'normal');
        doc.text("camelQ Bank", 20, 240);
        doc.text("Account Name: camelQ Software Solutions", 20, 245);
        doc.text("Account No.: 123-456-7890", 20, 250);
        doc.text("Pay by: 30 days from invoice date", 20, 255);
        
        // Right side - Company info
        doc.setFontSize(12);
        doc.setFont("helvetica", 'normal');
        doc.text("camelQ Software Solutions", 140, 220);
        
        doc.setFontSize(10);
        doc.text("123 Business Street, City, State 12345", 140, 230);
        doc.text("Phone: +91-12345-67890", 140, 235);
        doc.text("Email: info@camelq.com", 140, 240);
        
        doc.save(`invoice-${orderId}.pdf`);
        setDownloadingId(null);
      };
    }, 800);
  };

  if (loading) {
    return (
      <div className="orders-dashboard-panel">
        <div className="orders-loading">
          <Loader size={24} className="animate-spin" />
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

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
        <div className="orders-dashboard-panel">
          <div className="orders-login-prompt">
            <FileText size={48} color="#7c3aed" />
            <h2>Please Login to View Your Orders</h2>
            <p>Your session has expired. Please login again to continue.</p>
            <a href="/login" className="orders-login-btn">Login Now</a>
          </div>
        </div>
      );
    }
    return (
      <div className="orders-dashboard-panel">
        <div className="orders-error">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="orders-retry-btn"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-dashboard-panel">
      <div className="orders-filters-row">
        <div className="orders-filter-group">
          <label>Status:</label>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="orders-filter-select">
            {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="orders-filter-group">
          <label>Date:</label>
          <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="orders-filter-select">
            {dateOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      </div>
      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order, i) => (
              <tr key={order.id} className={i % 2 === 0 ? "orders-row-even" : "orders-row-odd"}>
                <td>{order.id}</td>
                <td>{order.product}</td>
                <td>{order.date}</td>
                <td>₹{order.amount}</td>
                <td className="orders-status-cell">
                  {getStatusIcon(order.status)}
                  <span className={`orders-status-text orders-status-${order.status.toLowerCase()}`}>{order.status}</span>
                </td>
                <td>
                  <button className="orders-invoice-btn" onClick={() => handleDownload(order.id)} disabled={downloadingId === order.id}>
                    <FileText size={16} style={{ marginRight: 4 }} />
                    {downloadingId === order.id ? "Downloading..." : "Download"}
                  </button>
                </td>
              </tr>
            ))}
            {paginatedOrders.length === 0 && (
              <tr><td colSpan={6} className="orders-empty">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="orders-pagination-row">
          <button className="orders-pagination-btn" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Previous</button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              className={`orders-pagination-btn${page === idx + 1 ? " active" : ""}`}
              onClick={() => handlePageChange(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button className="orders-pagination-btn" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>Next</button>
        </div>
      )}
    </div>
  );
} 