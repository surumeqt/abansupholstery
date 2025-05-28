import React, { useState } from 'react';
import ServiceInfo from './components/ServiceInfo';
import OrderSummary from './components/OrderSummary';
import QRCodeDisplay from './components/QRCodeDisplay';
import SavedReceipts from './components/SavedReceipts';
import { useMutation } from 'convex/react';
import { api } from './convex/_generated/api';
import './styles/app.css';

function App() {
  const [serviceData, setServiceData] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [orNumber, setOrNumber] = useState('');
  const saveReceipt = useMutation(api.CompanyReceipts.saveReceipt);
  const [showSavedReceipts, setShowSavedReceipts] = useState(false);
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
    setServiceData(null);
    setOrNumber('');
    setAnimateSummary(false);
  };

  const handleSaveImage = async (base64) => {
    const dataUrl = base64;
    try {
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
    setShowSummary(false);
    setServiceData(null);
    setOrNumber('');
    setAnimateSummary(false);
  };

  const handleShowAnalytics = () => {
    alert('Analytics button clicked!');
  };

  return (
    <>
      <div className="main-heading-container">
        <img className="logo" src="/logo(aban).jpg" alt="Aban's General Upholstery Logo" />
        <h1 className="main-heading">Aban's General Upholstery</h1>
      </div>

      {showSavedReceipts ? (
        <div className="saved-receipts-view full-screen-content">
          <button className="back-button" onClick={handleGoBackToMainForm}>
            ← Back to Main Form
          </button>
          <SavedReceipts />
        </div>
      ) : (
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
                <OrderSummary data={serviceData} onReset={handleReset} onSaveImage={handleSaveImage} />
                <QRCodeDisplay data={orNumber} />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;