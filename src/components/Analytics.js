import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'; // Import Recharts components

// Helper function to format currency
const formatCurrency = (amount) => {
  if (typeof amount === 'string' && amount.startsWith('₱')) {
    return amount;
  }
  return `₱${parseFloat(amount).toFixed(2)}`;
};

function Analytics() {
  const receipts = useQuery(api.CompanyReceipts.listReceipts);

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
  // Sort by amount descending for the list, and for consistent chart display
  salesByServiceArray.sort((a, b) => b.amount - a.amount);


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-inter">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl p-6 sm:p-8"> {/* Increased max-w for two columns */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Analytics Dashboard</h2>

        {receipts.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No data available for analytics.</p>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6"> {/* Main flex container for two columns */}
            {/* Left Column for Cards and Sales by Service List */}
            <div className="dashboard">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Grid for the top cards */}
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
              </div>

              {/* Sales by Service Section (List) */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Sales by Service (List)</h3>
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
            </div>

            {/* Right Column for the Graph */}
            <div className="flex-1 bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center justify-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Sales by Service (Chart)</h3>
              {salesByServiceArray.length === 0 ? (
                <p className="text-center text-gray-600">No data to display chart.</p>
              ) : (
                <ResponsiveContainer width="65%" height={250}>
                  <BarChart
                    data={salesByServiceArray}
                    margin={{
                      top: 5, right: 30, left: 20, bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="service"textAnchor="end" height={100} interval={0} /> {/* Rotate labels */}
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="amount" fill="#004581" name="Sales Amount" /> {/* Use your brand color */}
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;
