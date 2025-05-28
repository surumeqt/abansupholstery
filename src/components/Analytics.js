import React from 'react';
import { useQuery } from 'convex/react'; // Import useQuery
import { api } from '../convex/_generated/api'; // Adjust path based on your Convex setup

// Helper function to format currency
const formatCurrency = (amount) => {
  if (typeof amount === 'string' && amount.startsWith('₱')) {
    return amount;
  }
  return `₱${parseFloat(amount).toFixed(2)}`;
};

function Analytics() {
  // Use Convex's useQuery hook to fetch receipts
  const receipts = useQuery(api.CompanyReceipts.listReceipts);

  // useQuery returns undefined while loading, or null/error if there's an issue
  if (receipts === undefined) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 font-inter">
        <div className="text-lg font-semibold text-gray-700">Loading analytics data...</div>
      </div>
    );
  }

  if (receipts === null) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 font-inter">
        <div className="text-lg font-semibold text-red-600">Error loading analytics data. Please try again.</div>
      </div>
    );
  }

  // --- Analytics Calculations ---
  const totalSales = receipts.reduce((sum, receipt) => sum + (receipt.price || 0), 0);
  const numberOfReceipts = receipts.length;

  // Calculate sales by service
  const salesByService = receipts.reduce((acc, receipt) => {
    const service = receipt.serviceName || 'Unknown Service';
    acc[service] = (acc[service] || 0) + (receipt.price || 0);
    return acc;
  }, {});

  // Convert salesByService object to an array for rendering
  const salesByServiceArray = Object.entries(salesByService).map(([service, amount]) => ({
    service,
    amount,
  }));
  // Sort by amount descending
  salesByServiceArray.sort((a, b) => b.amount - a.amount);


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-inter">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6 sm:p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Analytics Dashboard</h2>

        {receipts.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No data available for analytics.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Sales Card */}
            <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold mb-2">Total Sales</h3>
              <p className="text-4xl font-bold">{formatCurrency(totalSales)}</p>
            </div>

            {/* Number of Receipts Card */}
            <div className="bg-green-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold mb-2">Total Receipts</h3>
              <p className="text-4xl font-bold">{numberOfReceipts}</p>
            </div>

            {/* Sales by Service Section */}
            <div className="lg:col-span-3 bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Sales by Service</h3>
              {salesByServiceArray.length === 0 ? (
                <p className="text-center text-gray-600">No service sales data.</p>
              ) : (
                <div className="space-y-3">
                  {salesByServiceArray.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm">
                      <span className="font-medium text-gray-700">{item.service}</span>
                      <span className="font-semibold text-blue-700">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* You can add more analytics cards here (e.g., Sales by Client, Top Services) */}

          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;
