// Updated calendarApi.ts with proper response handling

import apiClient from "./index";
import { EventInput } from "@fullcalendar/core";
import { AxiosResponse } from "axios";

export interface CalendarEvent {
  id: number;
  created: string;
  modified: string;
  title: string;
  start_date: string;
  due_date: string;
  status: number;
  color: string;
  object_id: number;
  created_by: number;
  content_type: number;
}

interface CalendarEventsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CalendarEvent[];
}

interface CalendarEventParams {
  include_task_event?: boolean;
  include_obligation_event?: boolean;
  include_breach_event?: boolean;
}

interface CreateEventPayload {
  title: string;
  start_date: string;
  due_date: string;
  color?: string;
  status?: number;
}

export const getCalendarEvents = async (
  params: CalendarEventParams = {}
): Promise<CalendarEventsResponse> => {
  const response: AxiosResponse<CalendarEventsResponse> = await apiClient.get(
    "/calender_event_service/calendar/",
    { params }
  );
  return response.data;
};

export const getCalendarEvent = async (id: number): Promise<CalendarEvent> => {
  const response: AxiosResponse<CalendarEvent> = await apiClient.get(
    `/calender_event_service/calendar/${id}/`
  );
  return response.data;
};

export const createCalendarEvent = async (
  payload: CreateEventPayload
): Promise<CalendarEvent> => {
  const response: AxiosResponse<CalendarEvent> = await apiClient.post(
    "/calender_event_service/calendar/",
    payload
  );
  return response.data;
};

export const updateCalendarEvent = async (
  id: number,
  payload: Partial<CreateEventPayload>
): Promise<CalendarEvent> => {
  const response: AxiosResponse<CalendarEvent> = await apiClient.patch(
    `/calender_event_service/calendar/${id}/`,
    payload
  );
  return response.data;
};

// DELETE calendar event
export const deleteCalendarEvent = async (id: number): Promise<void> => {
  await apiClient.delete(`/calender_event_service/calendar/${id}/`);
};

// Transform API event to FullCalendar event format
export const transformToCalendarEvent = (
  apiEvent: CalendarEvent
): EventInput => ({
  id: apiEvent.id.toString(),
  title: apiEvent.title,
  start: apiEvent.start_date,
  end: apiEvent.due_date,
  allDay: true,
  extendedProps: {
    calendar: apiEvent.color || "Primary",
  },
});

// Transform FullCalendar event to API payload
export const transformToApiPayload = (
  event: EventInput
): CreateEventPayload => ({
  title: event.title || "",
  start_date: event.start?.toString() || "",
  due_date: event.end?.toString() || event.start?.toString() || "",
  color: event.extendedProps?.calendar || "Primary",
});
