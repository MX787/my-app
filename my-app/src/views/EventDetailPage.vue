<template>
  <ion-page>
    <ion-header><ion-toolbar color="primary"><ion-title>Termindetails</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <div v-if="event">
        <ion-list inset>
          <ion-item><ion-label><p>Titel</p><h2>{{ event.title || 'Ohne Titel' }}</h2></ion-label></ion-item>
          <ion-item><ion-label><p>Ort</p><h2>{{ event.location || 'Kein Ort angegeben' }}</h2></ion-label></ion-item>
          <ion-item><ion-label><p>Startdatum</p><h2>{{ formatDate(event.startDate, event.isAllDay) }}</h2></ion-label></ion-item>
          <ion-item><ion-label><p>Enddatum</p><h2>{{ formatDate(event.endDate, event.isAllDay) }}</h2></ion-label></ion-item>
          <ion-item><ion-label><p>Ganztägig</p><h2>{{ event.isAllDay ? 'Ja' : 'Nein' }}</h2></ion-label></ion-item>
        </ion-list>

        <div v-if="event.location" class="actions">
          <ion-button expand="block" fill="outline" :href="mapsUrl" target="_blank">
            <ion-icon slot="start" :icon="mapOutline" />Auf Karte anzeigen
          </ion-button>
          <ion-button expand="block" fill="outline" @click="copyLocation">
            <ion-icon slot="start" :icon="copyOutline" />Ort kopieren
          </ion-button>
        </div>
        <ion-button expand="block" color="danger" @click="confirmDelete = true">
          <ion-icon slot="start" :icon="trashOutline" />Termin löschen
        </ion-button>
      </div>
      <div v-else class="empty"><p>Der Termin wurde nicht gefunden. Bitte öffne ihn erneut aus der Liste.</p></div>
      <ion-button expand="block" fill="clear" router-link="/events">Zurück zur Terminliste</ion-button>

      <div v-if="confirmDelete" class="dialog-backdrop" role="presentation" @click.self="confirmDelete = false">
        <section class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
          <h2 id="delete-title">Termin löschen?</h2>
          <p>„{{ event?.title }}“ wird unwiderruflich aus dem Gerätekalender gelöscht.</p>
          <div><ion-button fill="clear" @click="confirmDelete = false">Abbrechen</ion-button><ion-button color="danger" @click="removeEvent">Löschen</ion-button></div>
        </section>
      </div>
      <ion-toast :is-open="toastOpen" :message="toastMessage" :duration="1800" @didDismiss="toastOpen = false" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Clipboard } from '@capacitor/clipboard';
import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToast, IonToolbar } from '@ionic/vue';
import { copyOutline, mapOutline, trashOutline } from 'ionicons/icons';
import { deleteCalendarEvent, getCachedEvent } from '@/services/calendar';

const route = useRoute();
const router = useRouter();
const event = computed(() => getCachedEvent(String(route.params.id)));
const confirmDelete = ref(false);
const toastOpen = ref(false);
const toastMessage = ref('');
const mapsUrl = computed(() => `https://maps.google.com/?q=${encodeURIComponent(event.value?.location ?? '')}`);

function formatDate(timestamp: number, allDay: boolean): string {
  return new Intl.DateTimeFormat('de-DE', allDay ? { dateStyle: 'full' } : { dateStyle: 'full', timeStyle: 'short' }).format(new Date(timestamp));
}
async function copyLocation() {
  await Clipboard.write({ string: event.value?.location ?? '', label: 'Terminort' });
  toastMessage.value = 'Ort wurde kopiert.';
  toastOpen.value = true;
}
async function removeEvent() {
  if (!event.value) return;
  await deleteCalendarEvent(event.value.id);
  confirmDelete.value = false;
  await router.replace('/events');
}
</script>

<style scoped>
.actions { margin: 1.5rem 0; }
.empty { min-height: 50vh; display: grid; place-items: center; text-align: center; }
.dialog-backdrop { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 1.5rem; background: rgba(0,0,0,.55); }
.dialog { width: min(100%, 420px); padding: 1.25rem; border-radius: 16px; background: var(--ion-background-color); box-shadow: 0 12px 40px rgba(0,0,0,.3); }
.dialog h2 { margin-top: 0; }.dialog div { display: flex; justify-content: flex-end; }
</style>
