import { useState, useEffect, useRef } from "react";
import EditObligationModal from "./modals/eidtObligation";
import ViewObligationModal from "./modals/viewObligation";


// Mock data based on the image
const mockObligationsData = [
  {
    id: "RB1476",
    obligationNumber: "RB1476",
    instrument: "Energy Retail Code Of...",
    description: "Retailer notice of end...",
    type: "Type 2",
    obligationOwner: "FAHAD LIAQAT",
    obligationFailover: "STEVE PAPRAS",
    lastReviewDate: "-",
    isSignedOff: "No",
    evidence: "-",
    reference: "Clause 100(2)",
    personReviewed: "-",
    locationOfEvidence: "-",
    digital: "Energy Retail Code of Practice"
  },
  {
    id: "RB1477",
    obligationNumber: "RB1477",
    instrument: "Energy Retail Code Of...",
    description: "Liabilities and immuni...",
    type: "Type 2",
    obligationOwner: "FAHAD LIAQAT",
    obligationFailover: "STEVE PAPRAS",
    lastReviewDate: "-",
    isSignedOff: "No",
    evidence: "-",
    reference: "Clause 101(1)",
    personReviewed: "-",
    locationOfEvidence: "-",
    digital: "Energy Retail Code of Practice"
  },
  {
    id: "RB1478",
    obligationNumber: "RB1478",
    instrument: "Energy Retail Code Of...",
    description: "Indemnities...",
    type: "Type 2",
    obligationOwner: "FAHAD LIAQAT",
    obligationFailover: "STEVE PAPRAS",
    lastReviewDate: "-",
    isSignedOff: "No",
    evidence: "-",
    reference: "Clause 102(3)",
    personReviewed: "-",
    locationOfEvidence: "-",
    digital: "Energy Retail Code of Practice"
  },
  {
    id: "RB1479",
    obligationNumber: "RB1479",
    instrument: "Energy Retail Code Of...",
    description: "Notice of price or ban...",
    type: "Type 2",
    obligationOwner: "FAHAD LIAQAT",
    obligationFailover: "STEVE PAPRAS",
    lastReviewDate: "-",
    isSignedOff: "No",
    evidence: "-",
    reference: "Clause 103(2)",
    personReviewed: "-",
    locationOfEvidence: "-",
    digital: "Energy Retail Code of Practice"
  },
  {
    id: "RB1480",
    obligationNumber: "RB1480",
    instrument: "Energy Retail Code Of...",
    description: "Requirement for feed...",
    type: "Type 2",
    obligationOwner: "FAHAD LIAQAT",
    obligationFailover: "STEVE PAPRAS",
    lastReviewDate: "-",
    isSignedOff: "No",
    evidence: "-",
    reference: "Clause 104(1)",
    personReviewed: "-",
    locationOfEvidence: "-",
    digital: "Energy Retail Code of Practice"
  },
  {
    id: "RB1481",
    obligationNumber: "RB1481",
    instrument: "Energy Retail Code Of...",
    description: "Requirement for feed...",
    type: "Type 2",
    obligationOwner: "FAHAD LIAQAT",
    obligationFailover: "STEVE PAPRAS",
    lastReviewDate: "-",
    isSignedOff: "No",
    evidence: "-",
    reference: "Clause 105(2)",
    personReviewed: "-",
    locationOfEvidence: "-",
    digital: "Energy Retail Code of Practice"
  },
  {
    id: "RB1482",
    obligationNumber: "RB1482",
    instrument: "Energy Retail Code Of...",
    description: "Identification of...",
    type: "Type 2",
    obligationOwner: "FAHAD LIAQAT",
    obligationFailover: "STEVE PAPRAS",
    lastReviewDate: "-",
    isSignedOff: "No",
    evidence: "-",
    reference: "Clause 106(3)",
    personReviewed: "-",
    locationOfEvidence: "-",
    digital: "Energy Retail Code of Practice"
  },
  {
    id: "RB1483",
    obligationNumber: "RB1483",
    instrument: "Energy Retail Code Of...",
    description: "Identifying the demo...",
    type: "Type 2",
    obligationOwner: "FAHAD LIAQAT",
    obligationFailover: "STEVE PAPRAS",
    lastReviewDate: "-",
    isSignedOff: "No",
    evidence: "-",
    reference: "Clause 107(1)",
    personReviewed: "-",
    locationOfEvidence: "-",
    digital: "Energy Retail Code of Practice"
  },
];

interface ObligationsTableProps {
  className?: string;
}

export default function ObligationsTable({
  className = "",
}: ObligationsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedObligation, setSelectedObligation] = useState<any>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(mockObligationsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = mockObligationsData.slice(startIndex, endIndex);

  const handleEdit = (obligation: any) => {
    setSelectedObligation(obligation);
    setIsEditOpen(true);
    setOpenDropdownId(null);
  };

  const handleView = (obligation: any) => {
    setSelectedObligation(obligation);
    setIsViewOpen(true);
    setOpenDropdownId(null);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setSelectedObligation(null);
  };

  const closeViewModal = () => {
    setIsViewOpen(false);
    setSelectedObligation(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className={className}>
      {/* Table Container with rounded corners */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Table with fixed height and scrolling */}
        <div className="overflow-hidden">
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider border-b border-gray-200 dark:border-gray-600">
                    Obligation Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider border-b border-gray-200 dark:border-gray-600">
                    Instrument
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider border-b border-gray-200 dark:border-gray-600">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider border-b border-gray-200 dark:border-gray-600">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider border-b border-gray-200 dark:border-gray-600">
                    Obligation owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider border-b border-gray-200 dark:border-gray-600">
                    Last review date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider border-b border-gray-200 dark:border-gray-600 relative">
                    Is signed off
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentData.map((obligation) => (
                  <tr
                    key={obligation.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {obligation.obligationNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      <span
                        className="cursor-pointer hover:scale-105 transition-transform inline-block"
                        onClick={() => handleView(obligation)}
                      >
                        {obligation.instrument}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                      {obligation.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {obligation.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {obligation.obligationOwner}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {obligation.lastReviewDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 relative">
                      <div className="flex items-center justify-center">
                        <div
                          className="relative inline-block"
                          ref={
                            openDropdownId === obligation.id
                              ? dropdownRef
                              : null
                          }
                        >
                          <button
                            type="button"
                            className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              setOpenDropdownId(
                                openDropdownId === obligation.id
                                  ? null
                                  : obligation.id
                              );
                            }}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                          <div
                            className={`${
                              openDropdownId === obligation.id
                                ? "block"
                                : "hidden"
                            } absolute right-0 z-20 mt-1 w-32 origin-top-right rounded-lg bg-white dark:bg-gray-800 shadow-lg`}
                          >
                            <div className="py-1">
                              <button
                                onClick={() => handleEdit(obligation)}
                                className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              >
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                                Edit
                              </button>
                              <button
                                onClick={() => handleView(obligation)}
                                className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              >
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {renderPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() =>
                  typeof page === "number" && handlePageChange(page)
                }
                disabled={page === "..."}
                className={`px-3 py-2 text-sm font-medium border rounded-lg transition-colors ${
                  page === currentPage
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : page === "..."
                    ? "text-gray-400 cursor-default border-transparent"
                    : "text-gray-500 bg-white border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <div className="flex items-center">
            <button
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Modal References */}
      <EditObligationModal isOpen={isEditOpen} onClose={closeEditModal} />
      <ViewObligationModal 
        isOpen={isViewOpen} 
        onClose={closeViewModal} 
        obligationData={selectedObligation}
      />
    </div>
  );
}