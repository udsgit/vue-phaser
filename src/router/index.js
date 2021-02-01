import { createRouter, createWebHistory } from 'vue-router'
import Home from "@/components/Home";
import GitHub from "@/components/GitHub";
import Blog from "@/components/Blog";
import AboutMe from "@/components/AboutMe";


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/aboutMe',
    name: 'AboutMe',
    component: AboutMe
  },
  {
    path: '/blog',
    name: 'Blog',
    component: Blog
  },
  {
    path: '/github',
    name: 'GitHub',
    component: GitHub
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
