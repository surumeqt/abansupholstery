import React, { useState } from 'react';
import ServiceInfo from './components/ServiceInfo';
import OrderSummary from './components/OrderSummary';
import QRCodeDisplay from './components/QRCodeDisplay';
import { useMutation } from 'convex/react';
import { api } from './convex/_generated/api';
import './styles/app.css';


function App() {
  const [serviceData, setServiceData] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [orNumber, setOrNumber] = useState('');
  const saveReceipt = useMutation(api.companyReceipts.saveReceipt);

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
      });
    }
    catch (error) {
      console.error('Error saving receipt:', error);
    }
  };
  
  const handleServiceSubmit = (data) => {
    const or = data.orNumber;
    setOrNumber(or);
    setServiceData(data);
    setShowSummary(true);
  };

  const handleReset = () => {
    setServiceData('');
    setShowSummary(false);
    setOrNumber('');
  };
  
  return (
    <div className={`app-container ${showSummary ? 'shift-left' : ''}`}>
      <div className="screen">
        <ServiceInfo onSubmit={handleServiceSubmit} />
      </div>
      <div className="screen">
        {serviceData && (
          <>
            <OrderSummary data={serviceData} onReset={handleReset} onSaveImage={handleSaveImage}/>
            <QRCodeDisplay data={orNumber}/>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
