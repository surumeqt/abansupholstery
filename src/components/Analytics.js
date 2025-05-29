import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import '../styles/Analytics.css'; // Import the CSS file

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
      <div className="message-container">
        <div className="loading-message">Loading analytics data...</div>
      </div>
    );
  }

  if (receipts === null) {
    return (
      <div className="message-container">
        <div className="error-message">Error loading analytics data. Please try again.</div>
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
    <div className="analytics-container">
      <div className="analytics-card">
        <h2 className="analytics-title">Analytics Dashboard</h2>

        {receipts.length === 0 ? (
          <p className="no-data-message">No data available for analytics.</p>
        ) : (
          <div className="content-layout">
            {/* Left Column for Cards and Sales by Service List */}
            <div className="dashboard-section">
              <div className="card-grid">
                {/* Total Sales Card */}
                <div className="info-card blue">
                  <h3 className="info-card-title">Total Sales</h3>
                  <p className="info-card-value">{formatCurrency(totalSales)}</p>
                </div>

                {/* Number of Receipts Card */}
                <div className="info-card green">
                  <h3 className="info-card-title">Total Receipts</h3>
                  <p className="info-card-value">{numberOfReceipts}</p>
                </div>
              </div>

              {/* Sales by Service Section (List) */}
              <div className="sales-list-section">
                <h3 className="section-title">Sales by Service (List)</h3>
                {salesByServiceArray.length === 0 ? (
                  <p className="no-data-message">No service sales data.</p>
                ) : (
                  <div className="list-item-container">
                    {salesByServiceArray.map((item, index) => (
                      <div key={index} className="list-item">
                        <span className="list-item-service">{item.service}</span>
                        <span className="list-item-amount">{formatCurrency(item.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column for the Graph */}
            <div className="chart-section">
              <h3 className="section-title">Sales by Service (Chart)</h3>
              {salesByServiceArray.length === 0 ? (
                <p className="no-data-message">No data to display chart.</p>
              ) : (
                <ResponsiveContainer width="95%" height={250}>
                  <BarChart
                    data={salesByServiceArray}
                    margin={{
                      top: 5, right: 30, left: 20, bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="service"
                      angle={-45} // Rotate labels by -45 degrees
                      textAnchor="end"
                      height={100}
                      interval={0}
                      // Add a custom class for styling the X-axis labels if needed
                      className="recharts-xAxis-label"
                    />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="amount" fill="#004581" name="Sales Amount" />
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