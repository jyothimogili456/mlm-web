import React from "react";

const InvoicesPanel: React.FC = () => {
  return (
    <section className="dashboard-panel invoices-panel">
      <h2>Invoices & Bills</h2>
      <div className="invoices-table">[Invoice No., Product List, Download, Date, GST]</div>
    </section>
  );
};

export default InvoicesPanel; 