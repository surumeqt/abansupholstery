import React from 'react';
import QRCode from 'react-qr-code';

const QRCodeDisplay = ({ data }) => {
  return (
      <div className="card">
        <h2>QR Code</h2>
        <QRCode value={JSON.stringify({ receiptId: data })} size={225} />
        <p>OR Number: {data}</p>
      </div>
  );
};

export default QRCodeDisplay;
