import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import EventListPage from '../views/EventListPage.vue'
import EventDetailPage from '../views/EventDetailPage.vue'
import EventCreatePage from '../views/EventCreatePage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/events'
  },
  {
    path: '/events',
    name: 'EventList',
    component: EventListPage
  },
  {
    path: '/events/new',
    name: 'EventCreate',
    component: EventCreatePage
  },
  {
    path: '/events/:id',
    name: 'EventDetail',
    component: EventDetailPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
