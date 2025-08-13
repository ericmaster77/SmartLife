import React from 'react';
import Button from './Button';

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        {title && (
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
        )}
        
        <div className="mb-4">
          {children}
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;