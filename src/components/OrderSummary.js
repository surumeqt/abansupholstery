import { useRef, useState } from "react";
import html2canvas from "html2canvas";

const OrderSummary = ({ data, onReset, onSaveImage }) => {
  const cardRef = useRef(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const formatCurrency = (amount) => `₱${amount.toFixed(2)}`;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const canvas = await html2canvas(cardRef.current);
      const base64image = canvas.toDataURL("image/png");

      await onSaveImage(base64image);

      setIsSaved(true);
    } catch (error) {
      console.error("Failed to capture and save receipt:", error);
      setIsSaved(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="card" ref={cardRef}>
        <h2>Service Receipt</h2>
        <pre className="receipt-text">
{`==================== RECEIPT ====================
Company: ${data.companyInfo.name}
TIN: ${data.companyInfo.tin}
OR Number: ${data.orNumber}
Address: ${data.companyInfo.address}
Date: ${data.date}
------------------------------------------------
Client: ${data.clientName}
${data.clientAddress ? `Address: ${data.clientAddress}\n------------------------------------------------` : '------------------------------------------------'}
Service Name: ${data.serviceName}
Service Details: ${data.serviceDetails || 'N/A'}

Price: ${formatCurrency(data.price)}
================================================
Thank you for your business!
`}
        </pre>
      </div>

      <div className="buttons-group">
        <button onClick={handleSave} disabled={isSaving || isSaved} className="button-saved">
        {isSaving ? "Saving..." : isSaved ? "Saved!" : "Save The Receipt"}
        </button>
        {isSaved && <button onClick={onReset}>Reset</button>}
      </div>
    </>
  );
};

export default OrderSummary;
