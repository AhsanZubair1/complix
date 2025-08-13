import { Modal } from "../../components/ui/modal";

interface CalendarEvent {
  id?: string;
  title?: string;
  start?: Date;
  end?: Date;
  extendedProps?: {
    calendar: string;
  };
}

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  selectedEvent: CalendarEvent | null;
  eventTitle: string;
  eventStartDate: string;
  eventEndDate: string;
  eventLevel: string;
  errors: {
    title: string;
    startDate: string;
    endDate: string;
  };
  onTitleChange: (title: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onLevelChange: (level: string) => void;
  onSubmit: () => void;
  onDelete: () => void;
}

const calendarsEvents = {
  Danger: "danger",
  Success: "success",
  Primary: "primary",
  Warning: "warning",
};

const formatDateForLocalInput = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const CalendarModal = ({
  isOpen,
  onClose,
  currentView,
  selectedEvent,
  eventTitle,
  eventStartDate,
  eventEndDate,
  eventLevel,
  errors,
  onTitleChange,
  onStartDateChange,
  onEndDateChange,
  onLevelChange,
  onSubmit,
  onDelete,
}: CalendarModalProps) => {
  const isWeekOrDayView =
    currentView === "timeGridWeek" || currentView === "timeGridDay";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[700px] p-6 lg:p-10"
    >
      <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
        <div>
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            {selectedEvent ? "Edit Event" : "Add Event"}
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Plan your next big moment: schedule or edit an event to stay on
            track
          </p>
        </div>
        <div className="mt-8">
          <div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                id="event-title"
                type="text"
                value={eventTitle}
                onChange={(e) => onTitleChange(e.target.value)}
                className={`dark:bg-dark-900 h-11 w-full rounded-lg border ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>
          </div>
          <div className="mt-6">
            <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
              Event Color
            </label>
            <div className="flex flex-wrap items-center gap-4 sm:gap-5">
              {Object.entries(calendarsEvents).map(([key, value]) => (
                <div key={key} className="n-chk">
                  <div
                    className={`form-check form-check-${value} form-check-inline`}
                  >
                    <label
                      className="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400"
                      htmlFor={`modal${key}`}
                    >
                      <span className="relative">
                        <input
                          className="sr-only form-check-input"
                          type="radio"
                          name="event-level"
                          value={key}
                          id={`modal${key}`}
                          checked={eventLevel === key}
                          onChange={() => onLevelChange(key)}
                        />
                        <span
                          className={`rounded-full flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 box dark:border-gray-700`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full bg-white ${
                              eventLevel === key ? "block" : "hidden"
                            }`}
                          ></span>
                        </span>
                      </span>
                      {key}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Enter Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type={isWeekOrDayView ? "date" : "datetime-local"}
              value={formatDateForLocalInput(eventStartDate)}
              onChange={(e) =>
                onStartDateChange(new Date(e.target.value).toISOString())
              }
              className={`dark:bg-dark-900 h-11 w-full rounded-lg border ${
                errors.startDate ? "border-red-500" : "border-gray-300"
              } bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
            )}
          </div>

          <div className="mt-6">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Enter End Date <span className="text-red-500">*</span>
            </label>
            <input
              type={isWeekOrDayView ? "date" : "datetime-local"}
              value={formatDateForLocalInput(eventEndDate)}
              onChange={(e) =>
                onEndDateChange(new Date(e.target.value).toISOString())
              }
              className={`dark:bg-dark-900 h-11 w-full rounded-lg border ${
                errors.endDate ? "border-red-500" : "border-gray-300"
              } bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center mt-6 modal-footer">
          <div>
            {selectedEvent && (
              <button
                onClick={onDelete}
                type="button"
                className="btn btn-danger flex justify-center rounded-lg bg-[#0000FF] px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600"
              >
                Delete Event
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              type="button"
              className="flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
            >
              Close
            </button>
            <button
              onClick={onSubmit}
              type="button"
              className="btn btn-success btn-update-event flex justify-center rounded-lg bg-[#0000FF] px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
            >
              {selectedEvent ? "Edit" : "Add Event"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
