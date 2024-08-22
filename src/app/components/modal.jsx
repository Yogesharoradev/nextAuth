import React, { useState } from 'react';

const Modal = ({ isOpen, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm(); 
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
        <p className="mb-4">Are you sure you want to reset your password? A reset link will be sent to your email.</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none"
            disabled={loading} // Disable button during loading
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading} 
          >
            {loading ? 'Sending...' : 'Yes, Send Email'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
