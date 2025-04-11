import * as React from 'react';
import * as ReactModal from 'react-modal';
import './style.css';
import QRCode from 'react-qr-code';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface ShareModalProps {
    isOpen: boolean;
    newJoinUrl: string;
    onClose: () => void;
}

export function ShareModal({
  isOpen, newJoinUrl, onClose,
}: ShareModalProps) {
  // This is required for accessibility reasons.
  // You can alternatively set it on your root app component during app initialization.
  ReactModal.setAppElement('#app'); // Adjust '#root' to match your application's mount node ID.

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Share Options Modal"
      className="plugin-modal remote-camera-plugin"
      overlayClassName="modal-overlay"
    >
      <div
        style={{
          width: '100%', height: '100%', alignItems: 'center', display: 'flex', flexDirection: 'column',
        }}
      >
        <h2>Share camera using another device</h2>
        {
            /** Join URL available */
          newJoinUrl
            ? (
              <>
                <CopyToClipboard text={newJoinUrl} onCopy={onClose}>
                  <div className="copy-button-wrapper">
                    <i className="icon-bbb-copy" />
                    {' '}
                    Copy
                  </div>
                </CopyToClipboard>
                <QRCode
                  size={128}
                  style={{ height: '128', maxWidth: '128', width: '128' }}
                  value={newJoinUrl}
                  viewBox="0 0 128 128"
                />

                <div className="buttons-container">
                  <button type="button" onClick={onClose}>Close</button>
                </div>
              </>
            ) : null
        }
      </div>
    </ReactModal>
  );
}
