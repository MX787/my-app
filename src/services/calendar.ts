import { Capacitor } from '@capacitor/core';
import { CapacitorCalendar } from '@ebarooni/capacitor-calendar';
import type { CalendarEvent } from '@ebarooni/capacitor-calendar';

export type DeviceEvent = CalendarEvent;

export interface DeviceCalendar {
  id: string;
  title: string;
  color: string;
}

const eventsById = new Map<string, DeviceEvent>();

function ensureNative(): void {
  if (!Capacitor.isNativePlatform()) {
    throw new Error('Der Gerätekalender ist nur in der installierten Android-App verfügbar.');
  }
}

export async function requestCalendarAccess(): Promise<void> {
  ensureNative();
  const { result } = await CapacitorCalendar.requestFullCalendarAccess();
  if (result !== 'granted') {
    throw new Error('Ohne Kalenderzugriff können keine Termine angezeigt oder verwaltet werden.');
  }
}

export async function getCalendars(): Promise<DeviceCalendar[]> {
  ensureNative();
  const { result } = await CapacitorCalendar.listCalendars();
  return result.map(({ id, title, color }) => ({ id, title, color }));
}

export async function getDefaultCalendarId(): Promise<string | null> {
  ensureNative();
  const { result } = await CapacitorCalendar.getDefaultCalendar();
  return result?.id ?? null;
}

export async function loadDefaultCalendarEvents(): Promise<DeviceEvent[]> {
  await requestCalendarAccess();
  const defaultCalendarId = await getDefaultCalendarId();
  if (!defaultCalendarId) throw new Error('Auf dem Gerät wurde kein Standardkalender gefunden.');

  const { result } = await CapacitorCalendar.listEventsInRange({
    // The Android plugin expects a Java Long. Small JSON numbers arrive as Integer
    // and are rejected by PluginCall.getLong(), so use a full millisecond timestamp.
    from: new Date('2000-01-01T00:00:00Z').getTime(),
    to: new Date('2100-01-01T00:00:00').getTime(),
  });

  const sorted = result
    .filter((event) => event.calendarId === defaultCalendarId)
    .sort((a, b) => a.startDate - b.startDate);
  eventsById.clear();
  sorted.forEach((event) => eventsById.set(event.id, event));
  return sorted;
}

export function getCachedEvent(id: string): DeviceEvent | undefined {
  return eventsById.get(id);
}

export async function createCalendarEvent(input: {
  title: string;
  location: string;
  startDate: number;
  endDate: number;
  isAllDay: boolean;
  calendarId: string;
}): Promise<void> {
  ensureNative();
  await CapacitorCalendar.createEvent(input);
}

export async function deleteCalendarEvent(id: string): Promise<void> {
  ensureNative();
  await CapacitorCalendar.deleteEvent({ id });
  eventsById.delete(id);
}
