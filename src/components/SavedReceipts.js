import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import '../styles/SavedReceipts.css'; // Import the CSS file

// Helper function to format currency
const formatCurrency = (amount) => {
  if (typeof amount === 'string' && amount.startsWith('₱')) {
    return amount;
  }
  return `₱${parseFloat(amount).toFixed(2)}`;
};

function SavedReceipts() {
  const receipts = useQuery(api.CompanyReceipts.listReceipts);

  if (receipts === undefined) {
    return (
      <div className="message-container">
        <div className="loading-message">Loading receipts...</div>
      </div>
    );
  }

  if (receipts === null) {
    return (
      <div className="message-container">
        <div className="error-message">Error loading receipts. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="receipts-page-container">
      <div className="receipts-card-container">
        <h2 className="receipts-title">Saved Receipts</h2>

        {receipts.length === 0 ? (
          <p className="no-receipts-message">No receipts found.</p>
        ) : (
          <div className="receipts-grid">
            {receipts.map((data) => (
              <div key={data._id} className="receipt-item">
                <pre className="receipt-text">
                  {`==================== RECEIPT ====================
Company: ${data.company || 'N/A'}
TIN: ${data.TIN || 'N/A'}
OR Number: ${data.ORnumber || 'N/A'}
Address: ${data.companyAddress || 'N/A'}
Date: ${data.date || 'N/A'}
------------------------------------------------
Client: ${data.clientName || 'N/A'}
${data.clientAddress ? `Address: ${data.clientAddress}\n------------------------------------------------` : '------------------------------------------------'}
Service Name: ${data.serviceName || 'N/A'}
Service Details: ${data.serviceDetails || 'N/A'}

Price: ${formatCurrency(data.price || 0)}
================================================
Thank you for your business!
`}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedReceipts;