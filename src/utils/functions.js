// src/utils/functions.js

// Function to handle service submission
export const handleServiceSubmit = (data, setServiceData, setOrNumber, setAnimateSummary, setShowSummary) => {
  setServiceData(data);
  setOrNumber(data.orNumber);
  setAnimateSummary(true);
  setTimeout(() => {
    setShowSummary(true);
    setAnimateSummary(false);
  }, 500);
};

// Function to reset the view to the main form
export const handleReset = (setAnimateSummary, setServiceData, setShowSummary, setOrNumber) => {
  setAnimateSummary(true);
  setTimeout(() => {
    setServiceData(null);
    setShowSummary(false);
    setOrNumber('');
    setAnimateSummary(false);
  }, 500);
};

// Function to navigate to Saved Receipts view
export const handleShowSavedReceipts = (
  setShowSavedReceipts,
  setShowSummary,
  setShowAnalytics,
  setServiceData,
  setOrNumber,
  setAnimateSummary,
  setShowSettings, // New parameter
  setShowAbout // New parameter
) => {
  setShowSavedReceipts(true);
  setShowSummary(false);
  setShowAnalytics(false);
  setServiceData(null);
  setOrNumber('');
  setAnimateSummary(false);
  setShowSettings(false); // Reset new view state
  setShowAbout(false); // Reset new view state
};

// Function to save an image (receipt)
export const handleSaveImage = async (base64, serviceData, saveReceipt) => {
  const dataUrl = base64;
  try {
    if (!serviceData) {
      console.error("Service data is missing, cannot save receipt.");
      return;
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

// Function to go back to the main form from any other view
export const handleGoBackToMainForm = (
  setShowSavedReceipts,
  setShowAnalytics,
  setShowSummary,
  setServiceData,
  setOrNumber,
  setAnimateSummary,
  setShowSettings, // New parameter
  setShowAbout // New parameter
) => {
  setShowSavedReceipts(false);
  setShowAnalytics(false);
  setShowSummary(false);
  setServiceData(null);
  setOrNumber('');
  setAnimateSummary(false);
  setShowSettings(false); // Reset new view state
  setShowAbout(false); // Reset new view state
};

// Function to navigate to Analytics view
export const handleShowAnalytics = (
  setShowAnalytics,
  setShowSavedReceipts,
  setShowSummary,
  setServiceData,
  setOrNumber,
  setAnimateSummary,
  setShowSettings, // New parameter
  setShowAbout // New parameter
) => {
  setShowAnalytics(true);
  setShowSavedReceipts(false);
  setShowSummary(false);
  setServiceData(null);
  setOrNumber('');
  setAnimateSummary(false);
  setShowSettings(false); // Reset new view state
  setShowAbout(false); // Reset new view state
};

// NEW: Function to navigate to Settings view
export const handleShowSettings = (
  setShowSettings,
  setShowSavedReceipts,
  setShowAnalytics,
  setShowSummary,
  setServiceData,
  setOrNumber,
  setAnimateSummary,
  setShowAbout // New parameter
) => {
  setShowSettings(true);
  setShowSavedReceipts(false);
  setShowAnalytics(false);
  setShowSummary(false);
  setServiceData(null);
  setOrNumber('');
  setAnimateSummary(false);
  setShowAbout(false); // Reset new view state
};

// NEW: Function to navigate to About view
export const handleShowAbout = (
  setShowAbout,
  setShowSavedReceipts,
  setShowAnalytics,
  setShowSummary,
  setServiceData,
  setOrNumber,
  setAnimateSummary,
  setShowSettings // New parameter
) => {
  setShowAbout(true);
  setShowSavedReceipts(false);
  setShowAnalytics(false);
  setShowSummary(false);
  setServiceData(null);
  setOrNumber('');
  setAnimateSummary(false);
  setShowSettings(false); // Reset new view state
};


// Functions for Date Filter Modal
export const handleApplyDateFilter = (startDate, endDate, setFilteredDates, onClose) => {
  console.log('Applying filter for:', { startDate, endDate });
  setFilteredDates({ startDate, endDate });
  onClose(); // Close the modal after applying
  // Here you would typically trigger data fetching for SavedReceipts
};

export const handleClearDateFilter = (setFilteredDates, onClose) => {
  console.log('Clearing date filter');
  setFilteredDates({ startDate: '', endDate: '' });
  onClose(); // Close the modal after clearing
  // Here you would typically trigger data fetching for SavedReceipts with no filter
};