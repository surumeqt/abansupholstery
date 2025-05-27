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
  const [orNumber, setOrNumber] = useState(''); // State to hold OR number for QRCodeDisplay
  const saveReceipt = useMutation(api.CompanyReceipts.saveReceipt);
  const [showSavedReceipts, setShowSavedReceipts] = useState(false); // State to control SavedReceipts visibility

  // --- DEFINITIONS FOR MISSING HANDLER FUNCTIONS ---

  const handleServiceSubmit = (data) => {
    setServiceData(data);
    setShowSummary(true);
    setOrNumber(data.orNumber); // Set OR number here for QRCodeDisplay
  };

  const handleReset = () => {
    setServiceData(null);
    setShowSummary(false);
    setOrNumber('');
  };

  const handleShowSavedReceipts = () => {
    setShowSavedReceipts(true);
    setShowSummary(false); // Hide summary if it's open
    setServiceData(null); // Clear service data when viewing saved receipts
    setOrNumber(''); // Clear OR number
  };

  // --- CORRECTED handleSaveImage FUNCTION ---

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
        // *** THESE FIELDS ARE CRUCIAL AND WERE MISSING IN YOUR PROVIDED SNIPPET ***
        clientName: serviceData.clientName,
        clientAddress: serviceData.clientAddress, // This is optional in schema, so null/undefined/empty string is fine
        serviceName: serviceData.serviceName,
        serviceDetails: serviceData.serviceDetails, // This is optional in schema, so null/undefined/empty string is fine
        price: parseFloat(serviceData.price), // Ensure it's a number
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

  return (
    <>
      <div className="main-heading-container">
        <h1 className="main-heading">Aban's General Upholstery</h1>
      </div>

      {showSavedReceipts ? (
        <div className="saved-receipts-view">
          <button
            className="back-button"
            onClick={handleGoBackToMainForm}
          >
            ← Back to Main Form
          </button>
          <SavedReceipts />
        </div>
      ) : (
        <div className={`app-container ${showSummary ? 'shift-left' : ''}`}>

          <div className="screen initial-view-screen">
            <div className="left-panel-content">
              <div className="logo-and-text-wrapper">
                <img className="logo" src="/logo(aban).jpg" alt="Aban's General Upholstery Logo" />
                <p className="logo-tagline">Aban's General Upholstery</p>
              </div>
              <button
                className="check-receipt"
                onClick={handleShowSavedReceipts} // Using the defined function
              >
                Saved Receipts
              </button>
            </div>
            <ServiceInfo onSubmit={handleServiceSubmit} /> {/* Using the defined function */}
          </div>

          <div className="screen summary-view-screen">
            {serviceData && (
              <>
                <OrderSummary data={serviceData} onReset={handleReset} onSaveImage={handleSaveImage} /> {/* Using the defined function */}
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
