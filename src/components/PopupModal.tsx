import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import './PopupModal.css';

export interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  showCloseButton?: boolean;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const PopupModal: React.FC<PopupModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  showCloseButton = true,
  autoClose = false,
  autoCloseDelay = 3000
}) => {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={24} className="popup-icon success" />;
      case 'error':
        return <AlertCircle size={24} className="popup-icon error" />;
      case 'warning':
        return <AlertTriangle size={24} className="popup-icon warning" />;
      case 'info':
      default:
        return <Info size={24} className="popup-icon info" />;
    }
  };

  const getTypeClass = () => {
    return `popup-modal ${type}`;
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className={getTypeClass()} onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <div className="popup-title-section">
            {getIcon()}
            <h3 className="popup-title">{title}</h3>
          </div>
          {showCloseButton && (
            <button className="popup-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          )}
        </div>
        <div className="popup-content">
          <p className="popup-message">{message}</p>
        </div>
        <div className="popup-footer">
          <button className="popup-ok-btn" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupModal; 