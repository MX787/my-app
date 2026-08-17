<template>
  <ion-page>
    <ion-header><ion-toolbar color="primary"><ion-title>Termin hinzufügen</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <form @submit.prevent="save">
        <ion-list inset>
          <ion-item><ion-input v-model="form.title" label="Titel" label-placement="stacked" required /></ion-item>
          <ion-item><ion-input v-model="form.location" label="Ort" label-placement="stacked" /></ion-item>
          <ion-item><ion-select v-model="form.calendarId" label="Kalender" label-placement="stacked" interface="popover" required>
            <ion-select-option v-for="calendar in calendars" :key="calendar.id" :value="calendar.id">{{ calendar.title }}</ion-select-option>
          </ion-select></ion-item>
          <ion-item><ion-toggle v-model="form.isAllDay">Ganztägig</ion-toggle></ion-item>
          <ion-item><ion-input v-model="form.start" :type="form.isAllDay ? 'date' : 'datetime-local'" label="Startdatum" label-placement="stacked" required /></ion-item>
          <ion-item><ion-input v-model="form.end" :type="form.isAllDay ? 'date' : 'datetime-local'" label="Enddatum" label-placement="stacked" required /></ion-item>
        </ion-list>
        <p v-if="error" class="error">{{ error }}</p>
        <div class="buttons">
          <ion-button type="button" expand="block" fill="outline" :disabled="saving" @click="router.back()">Abbrechen</ion-button>
          <ion-button type="submit" expand="block" :disabled="saving || !calendars.length">{{ saving ? 'Speichert …' : 'Speichern' }}</ion-button>
        </div>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonList, IonPage, IonSelect, IonSelectOption, IonTitle, IonToggle, IonToolbar } from '@ionic/vue';
import { createCalendarEvent, getCalendars, getDefaultCalendarId, requestCalendarAccess, type DeviceCalendar } from '@/services/calendar';

const router = useRouter();
const calendars = ref<DeviceCalendar[]>([]);
const saving = ref(false);
const error = ref('');
const now = new Date();
const later = new Date(now.getTime() + 60 * 60 * 1000);
const localValue = (date: Date) => new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
const form = reactive({ title: '', location: '', calendarId: '', isAllDay: false, start: localValue(now), end: localValue(later) });

watch(() => form.isAllDay, (allDay) => {
  form.start = allDay ? form.start.slice(0, 10) : `${form.start.slice(0, 10)}T09:00`;
  form.end = allDay ? form.end.slice(0, 10) : `${form.end.slice(0, 10)}T10:00`;
});

onMounted(async () => {
  try {
    await requestCalendarAccess();
    calendars.value = await getCalendars();
    form.calendarId = (await getDefaultCalendarId()) ?? calendars.value[0]?.id ?? '';
  } catch (reason) { error.value = reason instanceof Error ? reason.message : 'Kalender konnten nicht geladen werden.'; }
});

async function save() {
  error.value = '';
  const startDate = new Date(form.start).getTime();
  const endDate = new Date(form.end).getTime();
  if (!form.title.trim()) return void (error.value = 'Bitte gib einen Titel ein.');
  if (!form.calendarId) return void (error.value = 'Bitte wähle einen Kalender aus.');
  if (!Number.isFinite(startDate) || !Number.isFinite(endDate) || endDate <= startDate) return void (error.value = 'Das Enddatum muss nach dem Startdatum liegen.');
  saving.value = true;
  try {
    await createCalendarEvent({ title: form.title.trim(), location: form.location.trim(), startDate, endDate, isAllDay: form.isAllDay, calendarId: form.calendarId });
    await router.replace('/events');
  } catch (reason) { error.value = reason instanceof Error ? reason.message : 'Termin konnte nicht gespeichert werden.'; }
  finally { saving.value = false; }
}
</script>

<style scoped>
.buttons { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; margin-top: 1.5rem; }
.error { color: var(--ion-color-danger); padding: 0 1rem; }
@media (max-width: 360px) { .buttons { grid-template-columns: 1fr; } }
</style>
