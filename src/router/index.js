import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/components/dashboard/Dashboard.vue')
    },
    {
      path: '/input',
      name: 'Input',
      component: () => import('@/components/input/Input.vue')
    },
    {
      path: '/output',
      name: 'Output',
      component: () => import('@/components/output/Output.vue')
    },
    {
      path: '/process',
      name: 'Process',
      component: () => import('@/components/process/Process.vue')
    },
    {
      path: '/reports',
      name: 'Reports',
      component: () => import('@/components/reports/Reports.vue')
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/components/settings/Settings.vue')
    }
  ]
})
