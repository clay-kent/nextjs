import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const SubmittingOverlay: React.FC<{ isSubmitting: boolean }> = ({ isSubmitting }) => {
  if (!isSubmitting) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex items-center rounded-lg bg-white px-8 py-4 shadow-lg">
        <FontAwesomeIcon
          icon={faSpinner}
          className="mr-2 animate-spin text-gray-500"
        />
        <div className="flex items-center text-gray-500">処理中...</div>
      </div>
    </div>
  );
};

export default SubmittingOverlay;