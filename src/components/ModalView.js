import { useState } from 'react';
import '../styles/modal.css'

function ModalView({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

function DateFilterModal({ onApplyFilter, onClearFilter, onClose }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleApply = () => {
    onApplyFilter(startDate, endDate);
    onClose();
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    onClearFilter();
    onClose();
  };

  return (
    <div className="date-filter-modal">
      <div className="input-group">
        <label htmlFor="start-date">Start Date:</label>
        <input
          type="date"
          id="start-date"
          className="modal-input-field"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="end-date">End Date:</label>
        <input
          type="date"
          id="end-date"
          className="modal-input-field"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div className="modal-actions">
        <button className="modal-button apply-button" onClick={handleApply}>
          Apply Filter
        </button>
        <button className="modal-button clear-button" onClick={handleClear}>
          Clear Filter
        </button>
      </div>
    </div>
  );
}

export { ModalView, DateFilterModal };