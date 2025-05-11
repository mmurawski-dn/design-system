import React from 'react';
import { DsButton, DsIcon } from '@design-system/ui';
import styles from './ds-modal.module.scss'

interface ModalProps {
  modalTitle?: string;
  isOpen: boolean;
  onClose?: () => void;
  onSave?: () => void;
  children: React.ReactNode;
  disableSave?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, disableSave, children, modalTitle }) => {
  if (!isOpen) return null;

  return (
    <>
    <div className={styles.modalOverlay}></div>
    <div className={styles.modalContainer}>
      <div className={styles.modalHeader}>
        <div className={styles.modalTitle}>{modalTitle}</div>
        <DsIcon
          name="close"
          onClick={onClose}
          size="medium"
          variant="filled"
          className={styles.closeButton}
        />
      </div>

      <div className={styles.modalContent}>{children}</div>
      <div className={styles.modalButtonContainer} >
        <DsButton
          onClick={onClose}
          schema="primary"
          variant="filled"
          className={styles.cancelButton}
        >
          cancel
        </DsButton>
        <DsButton
          onClick={onSave}
          schema="primary"
          variant="filled"
          disabled={disableSave}
          className={styles.saveButton}
        >
          save
        </DsButton>
      </div>

    </div>
    </>
  );
};



export default Modal;
