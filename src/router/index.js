import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../views/Landing.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: Landing
		},
		{
			path: '/submissions',
			name: 'submissions',
			// route level code-splitting
			// this generates a separate chunk (About.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import('../views/SubmissionPage.vue')
		},
		{
			path: '/:pathMatch(.*)*',
			name: 'dumb',
			component: () => import('../views/404.vue')
		}
	]
})

export default router
