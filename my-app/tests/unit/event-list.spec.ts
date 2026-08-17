import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import EventListPage from '@/views/EventListPage.vue';

vi.mock('@/services/calendar', () => ({
  loadDefaultCalendarEvents: vi.fn().mockResolvedValue([]),
}));

vi.mock('@ionic/vue', async () => {
  const actual = await vi.importActual<typeof import('@ionic/vue')>('@ionic/vue');
  return { ...actual, onIonViewWillEnter: vi.fn() };
});

describe('EventListPage', () => {
  test('zeigt Titel und Suchfeld', () => {
    const wrapper = mount(EventListPage, {
      global: {
        stubs: {
          IonPage: { template: '<main><slot /></main>' },
          IonHeader: { template: '<header><slot /></header>' },
          IonToolbar: { template: '<div><slot /></div>' },
          IonTitle: { template: '<h1><slot /></h1>' },
          IonButtons: { template: '<div><slot /></div>' },
          IonButton: { template: '<button><slot /></button>' },
          IonIcon: true,
          IonSearchbar: { template: '<input aria-label="Nach Titel suchen" />' },
          IonContent: { template: '<section><slot /></section>' },
          IonSpinner: true,
        },
      },
    });

    expect(wrapper.text()).toContain('Meine Termine');
    expect(wrapper.find('[aria-label="Nach Titel suchen"]').exists()).toBe(true);
  });
});
