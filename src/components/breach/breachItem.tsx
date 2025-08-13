import React from "react";
import { useModal } from "../../hooks/useModal";
import EditBreachModal from "./modals/editBreach";
import ViewBreachModal from "./modals/viewBreach";
import AddBreachModal from "./modals/addBreach";
import { Breach } from "../../api/Breach/BreachType.type";

interface BreachDataListProps {
  items: Breach[];
  onRefresh?: () => void;
}

const BreachDataList: React.FC<BreachDataListProps> = ({
  items,
  onRefresh,
}) => {
  const [selectedBreach, setSelectedBreach] = React.useState<Breach | null>(
    null
  );

  // Edit modal controls
  const {
    isOpen: isEditOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();

  // View modal controls
  const {
    isOpen: isViewOpen,
    openModal: openViewModal,
    closeModal: closeViewModal,
  } = useModal();

  const handleEditClick = (breach: Breach) => {
    setSelectedBreach(breach);
    openEditModal(); // Open EditBreachModal
  };

  const handleViewClick = (breach: Breach) => {
    setSelectedBreach(breach);
    openViewModal(); // Open ViewBreachModal
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <div
          key={item.id}
          className="px-4 bg-white border border-gray-200 task rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5"
        >
          <div className="flex items-center p-4 hover:bg-gray-50">
            {/* Main content (70%) */}
            <div className="grid grid-cols-3 gap-4 w-[70%]">
              {/* Column 1 */}
              <div className="space-y-2">
                <div className="text-md text-gray-600">{item.id}</div>
                <div className="text-md text-gray-600">
                  {formatDate(item.start_date)}
                </div>
                <div className="text-md text-gray-600">{item.title}</div>
                <div className="text-md text-gray-600">${item.wdp_amount}</div>
              </div>

              {/* Column 2 */}
              <div className="space-y-2">
                <div className="text-md text-gray-600">{item.id}</div>
                <div className="text-md text-gray-600">
                  {formatDate(item.identification_date)}
                </div>
                <div className="text-md text-gray-600">
                  {formatDate(item.due_date)}
                </div>
              </div>

              {/* Column 3 */}
              <div className="space-y-2">
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-sm font-medium whitespace-nowrap bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200">
                  Type {item.type}
                </span>
                <div>
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-sm font-medium whitespace-nowrap bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    Category {item.category}
                  </span>
                </div>
                <div className="text-md text-gray-600 px-2">
                  {item.category ? "Active" : "Inactive"}
                </div>
              </div>
            </div>

            {/* Buttons (30%) */}
            <div className="flex justify-end space-x-2 w-[30%]">
              <button
                onClick={() => handleEditClick(item)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleViewClick(item)}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl text-sm hover:bg-gray-300 transition-colors"
              >
                View
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Modals */}
      {selectedBreach && (
        <>
          <EditBreachModal
            isOpen={isEditOpen}
            onClose={closeEditModal}
            breach={selectedBreach}
            onRefresh={onRefresh}
          />
          <ViewBreachModal
            isOpen={isViewOpen}
            onClose={closeViewModal}
            breach={selectedBreach}
          />
        </>
      )}
    </div>
  );
};

export default BreachDataList;
