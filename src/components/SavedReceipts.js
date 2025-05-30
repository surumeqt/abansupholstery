import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import React, { useEffect } from 'react';
import '../styles/SavedReceipts.css';

function SavedReceipts({ filteredDates }) {
  const receipts = useQuery(
    api.CompanyReceipts.listReceiptsByDateRange,
    {
      startDate: filteredDates.startDate || undefined,
      endDate: filteredDates.endDate || undefined,
    }
  );

  useEffect(() => {
    console.log("SavedReceipts component received filteredDates:", filteredDates);
  }, [filteredDates]);

  if (receipts === undefined) {
    return (
      <div className="message-container">
        <div className="loading-message">Loading receipts...</div>
      </div>
    );
  }

  return (
    <div className="receipts-page-container">
      <div className="receipts-card-container">
        {receipts.length === 0 ? (
          <p className="no-receipts-message">
            No receipts found
            {filteredDates.startDate || filteredDates.endDate ? " for the selected dates." : "."}
          </p>
        ) : (
          <div className="receipts-grid">
            {receipts.map((data) => (
              <div key={data._id} className="receipt-item">
                <img
                  src={data.receiptUrl}
                  alt={`Receipt ${data.ORnumber}`}
                  className="receipt-image" // Apply a class for better styling control
                  // Remove inline style={{ borderRadius: '8px' }} and move to CSS
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedReceipts;