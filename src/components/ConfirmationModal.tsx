import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import './ConfirmationModal.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  loading = false
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="confirmation-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`confirmation-modal ${type}`}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="confirmation-modal-header">
            <div className="confirmation-modal-icon">
              <AlertTriangle size={24} />
            </div>
            <h3 className="confirmation-modal-title">{title}</h3>
            <button
              className="confirmation-modal-close"
              onClick={onClose}
              disabled={loading}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="confirmation-modal-content">
            <p className="confirmation-modal-message">{message}</p>
          </div>

          {/* Actions */}
          <div className="confirmation-modal-actions">
            <button
              className="confirmation-modal-btn cancel"
              onClick={onClose}
              disabled={loading}
            >
              {cancelText}
            </button>
            <button
              className={`confirmation-modal-btn confirm ${type}`}
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmationModal; 