<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Meine Termine</ion-title>
        <ion-buttons slot="end">
          <ion-button aria-label="Termin hinzufügen" router-link="/events/new">
            <ion-icon slot="icon-only" :icon="addOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar v-model="query" placeholder="Nach Titel suchen" />
      </ion-toolbar>
      <ion-toolbar v-if="calendarName" class="calendar-info">
        <ion-note>Standardkalender: {{ calendarName }}</ion-note>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div v-if="loading" class="center"><ion-spinner /><p>Termine werden geladen …</p></div>
      <div v-else-if="error" class="message">
        <ion-icon :icon="warningOutline" />
        <p>{{ error }}</p>
        <ion-button @click="loadEvents">Erneut versuchen</ion-button>
      </div>
      <ion-list v-else-if="filteredEvents.length">
        <ion-item v-for="event in filteredEvents" :key="event.id" button detail :router-link="`/events/${event.id}`">
          <ion-label>
            <h2>{{ event.title || 'Ohne Titel' }}</h2>
            <p>{{ formatDate(event.startDate, event.isAllDay) }}</p>
            <p v-if="event.location"><ion-icon :icon="locationOutline" /> {{ event.location }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
      <div v-else class="message">
        <ion-icon :icon="calendarOutline" />
        <p>{{ query ? 'Keine passenden Termine gefunden.' : 'Im Standardkalender sind keine Termine gespeichert.' }}</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onIonViewWillEnter, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonNote, IonPage, IonSearchbar, IonSpinner, IonTitle, IonToolbar } from '@ionic/vue';
import { addOutline, calendarOutline, locationOutline, warningOutline } from 'ionicons/icons';
import { getCalendars, getDefaultCalendarId, loadDefaultCalendarEvents, type DeviceEvent } from '@/services/calendar';

const events = ref<DeviceEvent[]>([]);
const query = ref('');
const loading = ref(true);
const error = ref('');
const calendarName = ref('');

const filteredEvents = computed(() => {
  const term = query.value.trim().toLocaleLowerCase('de');
  return term ? events.value.filter((event) => event.title.toLocaleLowerCase('de').includes(term)) : events.value;
});

function formatDate(timestamp: number, allDay: boolean): string {
  return new Intl.DateTimeFormat('de-DE', allDay
    ? { dateStyle: 'full' }
    : { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(timestamp));
}

async function loadEvents() {
  loading.value = true;
  error.value = '';
  try {
    events.value = await loadDefaultCalendarEvents();
    const defaultId = await getDefaultCalendarId();
    calendarName.value = (await getCalendars()).find((calendar) => calendar.id === defaultId)?.title ?? '';
  }
  catch (reason) { error.value = reason instanceof Error ? reason.message : 'Termine konnten nicht geladen werden.'; }
  finally { loading.value = false; }
}

onIonViewWillEnter(loadEvents);
</script>

<style scoped>
.center, .message { min-height: 45vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center; color: var(--ion-color-medium); }
.message ion-icon { font-size: 3rem; }
ion-item p ion-icon { vertical-align: -2px; }
.calendar-info { --min-height: 30px; text-align: center; }
</style>
