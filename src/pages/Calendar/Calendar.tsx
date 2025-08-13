import { useState, useRef, useEffect } from "react";
import useSWR from "swr";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import PageMeta from "../../components/common/PageMeta";
import {
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "../../api/CalenderApi";
import { CalendarModal } from "../../components/calender/CalendarModal";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
  };
  allDay?: boolean;
}

const utcToLocalDatetime = (utcString: string) => {
  if (!utcString) return "";

  const date = new Date(utcString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
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

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("Primary");
  const [errors, setErrors] = useState({
    title: "",
    startDate: "",
    endDate: "",
  });
  const [currentView, setCurrentView] = useState("dayGridMonth");
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  // Use SWR to fetch calendar events
  const {
    data: apiEvents,
    error,
    mutate,
  } = useSWR("/calender_event_service/calendar/", () =>
    getCalendarEvents({
      include_task_event: false,
      include_obligation_event: false,
      include_breach_event: false,
    })
  );

  const calendarsEvents = {
    Danger: "danger",
    Success: "success",
    Primary: "primary",
    Warning: "warning",
  };

  // Transform API events to FullCalendar format
  const events =
    apiEvents?.results.map((event) => {
      const isWeekDayView =
        currentView === "timeGridWeek" || currentView === "timeGridDay";
      return {
        id: event.id.toString(),
        title: event.title,
        start: utcToLocalDatetime(event.start_date),
        end: utcToLocalDatetime(event.due_date),
        extendedProps: { calendar: event.color || "Primary" },
        allDay: isWeekDayView, // Force allDay for week/day views
      };
    }) || [];

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    const startDate = new Date(selectInfo.startStr);
    const endDate = selectInfo.end
      ? new Date(selectInfo.endStr)
      : new Date(selectInfo.startStr);

    // For week and day views, set time to 00:00
    if (currentView === "timeGridWeek" || currentView === "timeGridDay") {
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
    }

    setEventStartDate(startDate.toISOString());
    setEventEndDate(endDate.toISOString());
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start ?? undefined,
      end: event.end ?? undefined,
      extendedProps: event.extendedProps,
    });
    setEventTitle(event.title);
    setEventStartDate(event.start?.toISOString() || "");
    setEventEndDate(event.end?.toISOString() || "");
    setEventLevel(event.extendedProps.calendar);
    openModal();
  };

  const handleViewChange = (viewInfo: any) => {
    setCurrentView(viewInfo.view.type);
  };

  const validateForm = () => {
    const newErrors = {
      title: "",
      startDate: "",
      endDate: "",
    };
    let isValid = true;

    if (!eventTitle.trim()) {
      newErrors.title = "Event title is required";
      isValid = false;
    }

    if (!eventStartDate) {
      newErrors.startDate = "Start date is required";
      isValid = false;
    }

    if (!eventEndDate) {
      newErrors.endDate = "End date is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddOrUpdateEvent = async () => {
    if (!validateForm()) return;

    const payload = {
      title: eventTitle,
      start_date: eventStartDate,
      due_date: eventEndDate,
      color: eventLevel,
    };

    try {
      if (selectedEvent?.id) {
        await updateCalendarEvent(parseInt(selectedEvent.id), payload);
      } else {
        await createCalendarEvent(payload);
      }
      mutate();
      closeModal();
      resetModalFields();
    } catch (error) {
      console.error("Failed to save event:", error);
    }
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent?.id) {
      try {
        await deleteCalendarEvent(parseInt(selectedEvent.id));
        mutate();
        closeModal();
        resetModalFields();
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel("Primary");
    setSelectedEvent(null);
    setErrors({
      title: "",
      startDate: "",
      endDate: "",
    });
  };

  const renderDateTimeInputs = () => {
    const isWeekOrDayView =
      currentView === "timeGridWeek" || currentView === "timeGridDay";

    return (
      <>
        <div className="mt-6">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Enter Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type={isWeekOrDayView ? "date" : "datetime-local"}
            value={formatDateForLocalInput(eventStartDate)}
            onChange={(e) =>
              setEventStartDate(new Date(e.target.value).toISOString())
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
              setEventEndDate(new Date(e.target.value).toISOString())
            }
            className={`dark:bg-dark-900 h-11 w-full rounded-lg border ${
              errors.endDate ? "border-red-500" : "border-gray-300"
            } bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
          )}
        </div>
      </>
    );
  };

  if (error) return <div>Error loading calendar events</div>;

  return (
    <>
      <PageMeta
        title="React.js Calendar Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Calendar Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="rounded-2xl border overflow-y-auto border-gray-200 h-screen bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="custom-calendar mb-8">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next addEventButton",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            selectable={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            datesSet={handleViewChange}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
              meridiem: "short",
            }}
            customButtons={{
              addEventButton: {
                text: "Add Event +",
                click: openModal,
              },
            }}
          />
        </div>
        <CalendarModal
          isOpen={isOpen}
          onClose={closeModal}
          currentView={currentView}
          selectedEvent={selectedEvent}
          eventTitle={eventTitle}
          eventStartDate={eventStartDate}
          eventEndDate={eventEndDate}
          eventLevel={eventLevel}
          errors={errors}
          onTitleChange={setEventTitle}
          onStartDateChange={setEventStartDate}
          onEndDateChange={setEventEndDate}
          onLevelChange={setEventLevel}
          onSubmit={handleAddOrUpdateEvent}
          onDelete={handleDeleteEvent}
        />
      </div>
    </>
  );
};

const renderEventContent = (eventInfo) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;

  // For week and day views, show only in all-day section
  if (
    eventInfo.view.type === "timeGridWeek" ||
    eventInfo.view.type === "timeGridDay"
  ) {
    if (!eventInfo.event.allDay) return null;
    return (
      <div
        className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
      >
        <div className="fc-daygrid-event-dot"></div>
        <div className="fc-event-title">{eventInfo.event.title}</div>
      </div>
    );
  }

  // For month view, show time if available
  const timeText = eventInfo.timeText || "";
  return (
    <div
      className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
    >
      <div className="fc-daygrid-event-dot"></div>
      {timeText && <div className="fc-event-time mr-1">{timeText}</div>}
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendar;
