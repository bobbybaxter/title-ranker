import React, { MouseEvent, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ show, onClose, title, children }: { show: any; onClose: any; title: any; children: any }) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleCloseClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = show ? (
    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
      <div className="modal-style">
        <div className="modal-header">
          {title && <div>{title}</div>}
          <a href="#" onClick={handleCloseClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </a>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(modalContent, document.getElementById('modal-root') as Element);
  } else {
    return null;
  }
};

export default Modal;
