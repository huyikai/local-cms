import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
      component: () => import('@/components/Layout/index.vue'),
      children: [
        {
          name: 'home',
          path: '/home',
          component: () => import('@/views/Home/index.vue')
        },
        {
          name: 'editor',
          path: '/editor',
          component: () => import('@/views/Editor/index.vue')
        }
      ]
    }
  ]
});

export default router;
