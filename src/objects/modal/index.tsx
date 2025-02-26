
import React from 'react';
import './style.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal( props:ModalProps) {
  return (
    <div className={`blur ${props.isOpen ? 'aberta' : 'fechada'}`}>
      <div className={`modal ${props.isOpen ? 'aberta' : 'fechada'}`}>
        <div className="modal-content">
          <button onClick={props.onClose}>Fechar</button>
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
