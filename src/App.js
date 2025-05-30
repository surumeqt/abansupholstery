import React, { useState } from 'react';
import ServiceInfo from './components/ServiceInfo';
import OrderSummary from './components/OrderSummary';
import QRCodeDisplay from './components/QRCodeDisplay';
import SavedReceipts from './components/SavedReceipts';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import About from './components/About';
import { ModalView, DateFilterModal } from './components/ModalView';
import { useMutation } from 'convex/react';
import { api } from './convex/_generated/api';
import './styles/app.css';
import { FaFilter, FaReceipt, FaChartBar, FaCog, FaInfoCircle } from "react-icons/fa";

import {
  handleServiceSubmit,
  handleReset,
  handleShowSavedReceipts,
  handleSaveImage,
  handleGoBackToMainForm,
  handleShowAnalytics,
  handleShowSettings,
  handleShowAbout,
  handleApplyDateFilter,
  handleClearDateFilter
} from './utils/functions';

function App() {
  const [serviceData, setServiceData] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [orNumber, setOrNumber] = useState('');
  const saveReceipt = useMutation(api.CompanyReceipts.saveReceipt);
  const [showSavedReceipts, setShowSavedReceipts] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [animateSummary, setAnimateSummary] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filteredDates, setFilteredDates] = useState({ startDate: '', endDate: '' });

  const _handleServiceSubmit = (data) =>
    handleServiceSubmit(data, setServiceData, setOrNumber, setAnimateSummary, setShowSummary);

  const _handleReset = () =>
    handleReset(setAnimateSummary, setServiceData, setShowSummary, setOrNumber);

  const _handleShowSavedReceipts = () =>
    handleShowSavedReceipts(
      setShowSavedReceipts,
      setShowSummary,
      setShowAnalytics,
      setServiceData,
      setOrNumber,
      setAnimateSummary,
      setShowSettings,
      setShowAbout
    );

  const _handleSaveImage = async (base64) =>
    handleSaveImage(base64, serviceData, saveReceipt);

  const _handleGoBackToMainForm = () =>
    handleGoBackToMainForm(
      setShowSavedReceipts,
      setShowAnalytics,
      setShowSummary,
      setServiceData,
      setOrNumber,
      setAnimateSummary,
      setShowSettings,
      setShowAbout
    );

  const _handleShowAnalytics = () =>
    handleShowAnalytics(
      setShowAnalytics,
      setShowSavedReceipts,
      setShowSummary,
      setServiceData,
      setOrNumber,
      setAnimateSummary,
      setShowSettings,
      setShowAbout
    );

  const _handleShowSettings = () =>
    handleShowSettings(
      setShowSettings,
      setShowSavedReceipts,
      setShowAnalytics,
      setShowSummary,
      setServiceData,
      setOrNumber,
      setAnimateSummary,
      setShowAbout
    );

  const _handleShowAbout = () =>
    handleShowAbout(
      setShowAbout,
      setShowSavedReceipts,
      setShowAnalytics,
      setShowSummary,
      setServiceData,
      setOrNumber,
      setAnimateSummary,
      setShowSettings
    );

  const handleOpenFilterModal = () => setIsFilterModalOpen(true);
  const handleCloseFilterModal = () => setIsFilterModalOpen(false);

  const _handleApplyDateFilter = (startDate, endDate) =>
    handleApplyDateFilter(startDate, endDate, setFilteredDates, handleCloseFilterModal);

  const _handleClearDateFilter = () =>
    handleClearDateFilter(setFilteredDates, handleCloseFilterModal);

  return (
    <>
      <div className="main-heading-container">
        <img className="logo" src="/logo(aban).jpg" alt="Aban's General Upholstery Logo" />
        <h1 className="main-heading">Aban's General Upholstery</h1>
      </div>
      {showSavedReceipts ? (
        <div className="saved-receipts-view">
          <div className='button-wrapper'>
            <button className='back-button' onClick={_handleGoBackToMainForm}>
              ← Back to Main Form
            </button>
            <button className='filter-button' onClick={handleOpenFilterModal}>
              Filter <FaFilter size={20} />
            </button>
            <button className='verify-button'>
              Verify Receipt
            </button>
          </div>
          <SavedReceipts filteredDates={filteredDates} />
        </div>
      ) : showAnalytics ? (
        <div className="analytics-view full-screen-content">
          <button className="back-button" onClick={_handleGoBackToMainForm}>
            ← Back to Main Form
          </button>
          <Analytics />
        </div>
      ) : showSettings ? (
        <div className="settings-view full-screen-content">
          <button className="back-button" onClick={_handleGoBackToMainForm}>
            ← Back to Main Form
          </button>
          <Settings />
        </div>
      ) : showAbout ? (
        <div className="about-view full-screen-content">
          <button className="back-button" onClick={_handleGoBackToMainForm}>
            ← Back to Main Form
          </button>
          <About />
        </div>
      ) : (
        <div className={`app-content-wrapper ${showSummary ? 'show-summary' : ''} ${animateSummary ? 'animate-summary' : ''}`}>
          <div className="initial-view-screen">
            <div className="left-panel-content">
              <div className="left-panel-button-grid">
                <button className="check-receipt" onClick={_handleShowSavedReceipts}>
                  <FaReceipt size={24} />
                  Saved Receipts
                </button>
                <button className="analytics" onClick={_handleShowAnalytics}>
                  <FaChartBar size={24} />
                  Analytics
                </button>
                <button className="settings-button" onClick={_handleShowSettings}>
                  <FaCog size={24} />
                  Settings
                </button>
                <button className="about-button" onClick={_handleShowAbout}>
                  <FaInfoCircle size={24} />
                  About
                </button>
              </div>
            </div>
            <div className="right-panel-content">
              <ServiceInfo onSubmit={_handleServiceSubmit} />
            </div>
          </div>
          <div className="summary-view-screen">
            {serviceData && (
              <>
                <div className='summary-container'>
                  <div className='order-summary'>
                    <OrderSummary data={serviceData} onReset={_handleReset} onSaveImage={_handleSaveImage} />
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

      <ModalView
        isOpen={isFilterModalOpen}
        onClose={handleCloseFilterModal}
        title="Filter Receipts by Date"
      >
        <DateFilterModal
          onApplyFilter={_handleApplyDateFilter}
          onClearFilter={_handleClearDateFilter}
          onClose={handleCloseFilterModal}
        />
      </ModalView>
    </>
  );
}

export default App;