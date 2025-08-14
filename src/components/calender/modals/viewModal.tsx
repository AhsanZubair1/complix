import { Modal } from "../../ui/modal";

export const CalendarViewModal = ({
  isOpen,
  onClose,
  currentView,
  selectedEvent,
  onEditClick,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  selectedEvent: any;
  onEditClick: () => void;
}) => {
  if (!selectedEvent) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[700px] p-6 lg:p-10"
    >
      <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
        <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
          {selectedEvent.title}
        </h5>

        <div className="mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {selectedEvent.created}
          </p>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 mt-4">
            Items : {selectedEvent.title}
          </p>
        </div>

        {/* separator */}
        <div className="h-[1px] w-full bg-gray-200 my-4" />

        <div className="flex justify-end gap-2">
          <button
            onClick={onEditClick}
            type="button"
            className="btn btn-success flex justify-center rounded-lg bg-[#0000FF] px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-600"
          >
            Edit
          </button>
        </div>
      </div>
    </Modal>
  );
};
