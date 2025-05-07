import React, { useState } from 'react';

const ServiceInfo = ({ onSubmit }) => {
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [serviceDetails, setServiceDetails] = useState('');
  const [price, setPrice] = useState('');

  const companyInfo = {
    name: "Aban's General UpHolstery",
    tin: '987-654-3210',
    address: 'no. 62 E 20th St., Olongapo, Philippines',
  };

  const handleCheckout = () => {
    if (!clientName || !serviceName || !price) {
      alert('Please fill in required fields.');
      return;
    }

    const currentDate = new Date().toLocaleDateString();
    const generateORNumber = () => {
      const now = Date.now();
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      return `OR-${now.toString().slice(-6)}-${random}`;
    };

    const receiptData = {
      companyInfo,
      clientName,
      clientAddress,
      serviceName,
      serviceDetails,
      price: parseFloat(price),
      date: currentDate,
      orNumber: generateORNumber(),
    };

    onSubmit(receiptData);
    setClientName('');
    setClientAddress('');
    setServiceName('');
    setServiceDetails('');
    setPrice('');
  };

  return (
    <div className="service-info-card">
      <h2>Service Info</h2>
      <div className="client-info">
        <input
          className="input-field"
          value={clientName}
          placeholder="Client Name"
          onChange={(e) => setClientName(e.target.value)}
        />
        <input
          className="input-field"
          value={clientAddress}
          placeholder="Client Address"
          onChange={(e) => setClientAddress(e.target.value)}
        />
      </div>

      <input
        className="input-field"
        value={serviceName}
        placeholder="Service Name"
        onChange={(e) => setServiceName(e.target.value)}
      />
      
      <textarea
        className="input-field service-details"
        value={serviceDetails}
        placeholder="Service Details"
        onChange={(e) => setServiceDetails(e.target.value)}
      />
      
      <input
        type="number"
        className="input-field"
        value={price}
        placeholder="Service Price"
        onChange={(e) => setPrice(e.target.value)}
      />

      <button className="submit-btn" onClick={handleCheckout}>Submit</button>
    </div>
  );
};

export default ServiceInfo;
