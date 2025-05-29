import React, { useState } from 'react';
import ServiceInfo from './components/ServiceInfo';
import OrderSummary from './components/OrderSummary';
import QRCodeDisplay from './components/QRCodeDisplay';
import SavedReceipts from './components/SavedReceipts';
import Analytics from './components/Analytics'; // Ensure Analytics is imported
import { useMutation } from 'convex/react';
import { api } from './convex/_generated/api';
import './styles/app.css';

function App() {
  const [serviceData, setServiceData] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [orNumber, setOrNumber] = useState('');
  const saveReceipt = useMutation(api.CompanyReceipts.saveReceipt);
  const [showSavedReceipts, setShowSavedReceipts] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false); // Declare showAnalytics state
  const [animateSummary, setAnimateSummary] = useState(false);

  const handleServiceSubmit = (data) => {
    setServiceData(data);
    setOrNumber(data.orNumber);
    setAnimateSummary(true);
    setTimeout(() => {
      setShowSummary(true);
      setAnimateSummary(false);
    }, 500);
  };

  const handleReset = () => {
    setAnimateSummary(true);
    setTimeout(() => {
      setServiceData(null);
      setShowSummary(false);
      setOrNumber('');
      setAnimateSummary(false);
    }, 500);
  };

  const handleShowSavedReceipts = () => {
    setShowSavedReceipts(true);
    setShowSummary(false);
    setShowAnalytics(false); // Hide analytics when showing saved receipts
    setServiceData(null);
    setOrNumber('');
    setAnimateSummary(false);
  };

  const handleSaveImage = async (base64) => {
    const dataUrl = base64;
    try {
      // Add a check to ensure serviceData is not null before proceeding
      if (!serviceData) {
        console.error("Service data is missing, cannot save receipt.");
        return; // Exit if serviceData is null
      }
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
        serviceType: serviceData.companyInfo.serviceType,
        price: parseFloat(serviceData.price),
      });
      console.log('Receipt saved successfully!');
    } catch (error) {
      console.error('Error saving receipt:', error);
    }
  };

  const handleGoBackToMainForm = () => {
    setShowSavedReceipts(false);
    setShowAnalytics(false); // Hide analytics when going back to main form
    setShowSummary(false);
    setServiceData(null);
    setOrNumber('');
    setAnimateSummary(false);
  };

  const handleShowAnalytics = () => {
    setShowAnalytics(true); // Show analytics component
    setShowSavedReceipts(false); // Hide saved receipts
    setShowSummary(false); // Hide summary
    setServiceData(null); // Clear service data
    setOrNumber(''); // Clear OR number
    setAnimateSummary(false);
  };

  return (
    <>
      <div className="main-heading-container">
        <img className="logo" src="/logo(aban).jpg" alt="Aban's General Upholstery Logo" />
        <h1 className="main-heading">Aban's General Upholstery</h1>
      </div>

      {showSavedReceipts ? (
        <div className="saved-receipts-view">
          <button className="back-button" onClick={handleGoBackToMainForm}>
            ← Back to Main Form
          </button>
          <SavedReceipts />
        </div>
      ) : showAnalytics ? ( // New condition to render Analytics when showAnalytics is true
        <div className="analytics-view full-screen-content">
          <button className="back-button" onClick={handleGoBackToMainForm}>
            ← Back to Main Form
          </button>
          <Analytics />
        </div>
      ) : ( // This block now covers the initial view AND the summary view, still wrapped in app-content-wrapper
        <div className={`app-content-wrapper ${showSummary ? 'show-summary' : ''} ${animateSummary ? 'animate-summary' : ''}`}>
          <div className="initial-view-screen">
            <div className="left-panel-content">
              <div className="left-panel-button-grid">
                <button className="check-receipt" onClick={handleShowSavedReceipts}>
                  Saved Receipts
                </button>
                <button className="analytics" onClick={handleShowAnalytics}>
                  Analytics
                </button>
              </div>
            </div>
            <div className="right-panel-content">
              <ServiceInfo onSubmit={handleServiceSubmit} />
            </div>
          </div>
          <div className="summary-view-screen">
            {serviceData && (
              <>
                <div className='summary-container'>
                  <div className='order-summary'>
                    <OrderSummary data={serviceData} onReset={handleReset} onSaveImage={handleSaveImage} />
                  </div>
                  <div className='qr-display'>
                    <QRCodeDisplay data={orNumber} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
