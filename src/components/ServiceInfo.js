import React, { useState } from 'react';

const ServiceInfo = ({ onSubmit }) => {
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [serviceName, setServiceName] = useState(''); // This will now hold the selected service
  const [serviceDetails, setServiceDetails] = useState('');
  const [price, setPrice] = useState('');

  // Define your list of services here
  const serviceOptions = [
    "Sofa Reupholstery",
    "Chair Reupholstery",
    "Cushion Refilling",
    "Custom Upholstery",
    "Furniture Repair",
    "Fabric Cleaning",
    "Boat Upholstery",
    "Car Interior Upholstery",
    "Other" // Added an 'Other' option for flexibility
  ];

  const companyInfo = {
    name: "Aban's General UpHolstery",
    tin: '987-654-3210',
    address: 'no. 62 E 20th St., Olongapo, Philippines',
  };

  const handleCheckout = () => {
    // Basic validation for required fields
    if (!clientName || !serviceName || serviceName === "" || !price) {
      alert('Please fill in all required fields (Client Name, Service Name, Price).');
      return;
    }

    // *** NEW: Robust price validation ***
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      alert('Please enter a valid number for the Service Price.');
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
      price: parsedPrice, // Use the parsed and validated price
      date: currentDate,
      orNumber: generateORNumber(),
    };

    onSubmit(receiptData);
    setClientName('');
    setClientAddress('');
    setServiceName(''); // Reset service name to empty string
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
          placeholder="Client Name *" // Added asterisk for required
          onChange={(e) => setClientName(e.target.value)}
        />
        <input
          className="input-field"
          value={clientAddress}
          placeholder="Client Address"
          onChange={(e) => setClientAddress(e.target.value)}
        />
      </div>

      <select
        className="input-field" // Reuse input field styles
        value={serviceName}
        onChange={(e) => setServiceName(e.target.value)}
      >
        <option value="" disabled>Select a Service *</option> {/* Default disabled option */}
        {serviceOptions.map((service, index) => (
          <option key={index} value={service}>
            {service}
          </option>
        ))}
      </select>

      <textarea
        className="input-field service-details"
        value={serviceDetails}
        placeholder="Service Details"
        onChange={(e) => setServiceDetails(e.target.value)}
      />

      <input
        type="number" // Ensure keyboard is numeric on mobile
        className="input-field"
        value={price}
        placeholder="Service Price *" // Added asterisk for required
        onChange={(e) => setPrice(e.target.value)}
      />

      <button className="submit-btn" onClick={handleCheckout}>Submit</button>
    </div>
  );
};

export default ServiceInfo;
