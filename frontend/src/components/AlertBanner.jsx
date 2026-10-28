import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function AlertBanner({ alert, onDismiss }) {
  if (!alert) return null;

  const isSuccess = alert.type === 'success';

  return (
    <div className={`alert-toast ${isSuccess ? 'toast-success' : 'toast-error'}`} role="alert">
      <div className="toast-icon">
        {isSuccess ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      </div>
      <div className="toast-content">
        <span className="toast-message">{alert.message}</span>
      </div>
      <button
        type="button"
        className="toast-close"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}
