import React, { useState } from 'react';
import ServiceInfo from './components/ServiceInfo';
import OrderSummary from './components/OrderSummary';
import QRCodeDisplay from './components/QRCodeDisplay';
import SavedReceipts from './components/SavedReceipts';
import { useMutation } from 'convex/react';
import { api } from './convex/_generated/api';
import './styles/app.css'; // Ensure you have the correct path to your CSS file

function App() {
  const [serviceData, setServiceData] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [orNumber, setOrNumber] = useState('');
  const saveReceipt = useMutation(api.CompanyReceipts.saveReceipt);
  const [showSavedReceipts, setShowSavedReceipts] = useState(false);

  const handleServiceSubmit = (data) => {
    setServiceData(data);
    setShowSummary(true); // This will now switch to displaying the summary screen
    setOrNumber(data.orNumber);
  };

  const handleReset = () => {
    setServiceData(null);
    setShowSummary(false); // This will now switch back to displaying the initial screen
    setOrNumber('');
  };

  const handleShowSavedReceipts = () => {
    setShowSavedReceipts(true);
    setShowSummary(false); // Hide summary if it's open
    setServiceData(null); // Clear service data when viewing saved receipts
    setOrNumber(''); // Clear OR number
  };

  const handleSaveImage = async (base64) => {
    const dataUrl = base64;
    try {
      // IMPORTANT: Ensure all fields expected by the Convex 'saveReceipt' mutation are passed
      await saveReceipt({
        receiptUrl: dataUrl,
        company: serviceData.companyInfo.name,
        TIN: serviceData.companyInfo.tin,
        ORnumber: serviceData.orNumber,
        companyAddress: serviceData.companyInfo.address,
        date: serviceData.date,
        clientName: serviceData.clientName,
        clientAddress: serviceData.clientAddress,
        serviceName: serviceData.serviceName,
        serviceDetails: serviceData.serviceDetails,
        serviceType: serviceData.companyInfo.serviceType, // Ensure this is correctly passed
        price: parseFloat(serviceData.price),
      });
      console.log('Receipt saved successfully!');
    } catch (error) {
      console.error('Error saving receipt:', error);
      // It's better to catch and log errors here. Re-throwing is optional.
    }
  };

  const handleGoBackToMainForm = () => {
    setShowSavedReceipts(false);
    setShowSummary(false); // Ensure summary is hidden when going back to main form
    setServiceData(null); // Reset service data
    setOrNumber(''); // Reset OR number
  };

  // Placeholder for analytics button click handler
  const handleShowAnalytics = () => {
    alert('Analytics button clicked!'); // Replace with actual analytics view logic
  };

  return (
    <>
      {/* Main Heading Container: Logo and Title at the very top */}
      <div className="main-heading-container">
        {/* Logo placed first to appear on the left */}
        <img className="logo" src="/logo(aban).jpg" alt="Aban's General Upholstery Logo" />
        {/* Main heading */}
        <h1 className="main-heading">Aban's General Upholstery</h1>
      </div>

      {/* Conditional rendering for the main content area below the header */}
      {showSavedReceipts ? (
        <div className="saved-receipts-view full-screen-content">
          <button
            className="back-button"
            onClick={handleGoBackToMainForm}
          >
            ← Back to Main Form
          </button>
          <SavedReceipts />
        </div>
      ) : showSummary ? (
        <div className="summary-view-screen full-screen-content">
          {serviceData && (
            <>
              <OrderSummary data={serviceData} onReset={handleReset} onSaveImage={handleSaveImage} />
              <QRCodeDisplay data={orNumber} />
            </>
          )}
        </div>
      ) : (
        <div className="initial-view-screen full-screen-content">
          {/* Left Panel Content: Buttons are now direct children */}
          <div className="left-panel-content">
            <button
              className="check-receipt"
              onClick={handleShowSavedReceipts}
            >
              Saved Receipts
            </button>
            <button
              className="analytics"
              onClick={handleShowAnalytics}
            >
              Analytics
            </button>
          </div>
          <ServiceInfo onSubmit={handleServiceSubmit} />
        </div>
      )}
    </>
  );
}

export default App;
