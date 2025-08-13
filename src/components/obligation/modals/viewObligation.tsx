import React from "react";
import { Modal } from "../../ui/modal";



interface ViewObligationModalProps {
  isOpen: boolean;
  onClose: () => void;
  obligationData?: {
    id: string;
    obligationNumber: string;
    digital: string;
    instrument: string;
    type: string;
    obligationOwner: string;
    obligationFailover: string;
    description: string;
    evidence: string;
    reference: string;
    personReviewed: string;
    locationOfEvidence: string;
    lastReviewDate: string;
    isSignedOff: string;
  };
}

const ViewObligationModal: React.FC<ViewObligationModalProps> = ({
  isOpen,
  onClose,
  obligationData
}) => {
  if (!isOpen || !obligationData) return null;

  const InfoRow = ({ label, value, className = "" }: { label: string; value: string; className?: string }) => (
    <div className={`py-4 ${className}`}>
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white w-1/3">{label}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 w-2/3 text-left">{value || "-"}</p>
      </div>
      <div className="border-b border-gray-200 dark:border-gray-700 mt-4"></div>
    </div>
  );

  const description = obligationData.description === "Retailer notice of end..." 
    ? "Retailer notice of end of fixed term retail contract\nRetailer obligation to notify a small customer with a fixed term retail contract that the contract or arrangement is due to end."
    : obligationData.description;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-4xl w-full max-h-[90vh] m-4"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden flex flex-col h-full">
        {/* Header - Fixed */}
        <div className="flex items-start justify-between p-6 pb-4 flex-shrink-0">
          <div className="flex items-start space-x-4">
            {/* DigiU Logo */}
            <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">DigiU</span>
            </div>
            
            {/* Header Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{obligationData.obligationNumber}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{obligationData.digital}</p>
              <div className="mt-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  {obligationData.type}
                </span>
              </div>
            </div>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="space-y-0">
            <InfoRow label="Obligation owner" value={obligationData.obligationOwner} />
            <InfoRow label="Obligation failover" value={obligationData.obligationFailover} />
            
            {/* Description with special handling for multi-line */}
            <div className="py-4">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white w-1/3">Description</h3>
                <div className="w-2/3 text-left">
                  <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line break-words">{description}</p>
                </div>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 mt-4"></div>
            </div>

            <InfoRow label="Evidence" value={obligationData.evidence} />
            
            {/* Instrument with full text display */}
            <div className="py-4">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white w-1/3">Instrument</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 w-2/3 text-left break-words">{obligationData.instrument || "-"}</p>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 mt-4"></div>
            </div>
            
            <InfoRow label="Reference" value={obligationData.reference} />
            <InfoRow label="Person reviewed" value={obligationData.personReviewed} />
            <InfoRow label="Location of evidence" value={obligationData.locationOfEvidence} />
            <InfoRow label="Last review date" value={obligationData.lastReviewDate} />
            
            {/* Last row without border */}
            <div className="py-4">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white w-1/3">Is Signed off</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 w-2/3 text-left">{obligationData.isSignedOff || "-"}</p>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex justify-start mt-6 pt-4">
            <button
              onClick={() => {/* Edit functionality would go here */}}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewObligationModal;