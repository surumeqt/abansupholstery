import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

// Helper function to format currency
const formatCurrency = (amount) => {
  if (typeof amount === 'string' && amount.startsWith('₱')) {
    return amount;
  }
  return `₱${parseFloat(amount).toFixed(2)}`;
};

function SavedReceipts() {
  // Use Convex's useQuery hook to fetch receipts
  // 'listReceipts' should be a query function defined in your Convex backend, e.g., in convex/CompanyReceipts.ts
  const receipts = useQuery(api.CompanyReceipts.listReceipts);

  // useQuery returns undefined while loading, or null/error if there's an issue
  if (receipts === undefined) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 font-inter">
        <div className="text-lg font-semibold text-gray-700">Loading receipts...</div>
      </div>
    );
  }

  if (receipts === null) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 font-inter">
        <div className="text-lg font-semibold text-red-600">Error loading receipts. Please try again.</div>
      </div>
    );
  }

  // Assuming receipts is an array once loaded
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-inter">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6 sm:p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Saved Receipts</h2>

        {receipts.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No receipts found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {receipts.map((data) => (
              <div key={data._id} className="bg-gray-50 p-5 rounded-lg shadow-md border border-gray-200 overflow-x-auto">
                {/* Ensure your Convex data structure matches this format */}
                <pre className="receipt-text text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
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
