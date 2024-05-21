import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import CreateAccount from '@/components/CreateAccount.vue';
import AuthentificationPage from '@/components/AuthentificationForm.vue';
import ajouterV from '@/components/ajouterC.vue';
import LoadingPage from './components/LoadingPage.vue';
import MesVehicules from './components/mesCertificat.vue';
import detailsVehicule from './components/detailsCertificat.vue';
import side_barre from './components/layouts/side_barre.vue';
import modifierUser from './components/modifierUser.vue';
import PasswordReset from './components/ForgotPassword.vue';
const routes = [
  { path: '/CreateAccount', component: CreateAccount },
  { path: '/', component: LoadingPage },
  { path: '/auth', component: AuthentificationPage },
  { path: '/ajouterV', component: ajouterV },
  {
    path: '/modifier-user/:userId?',
    name: 'modifierUser',
    component: modifierUser
  },
  {
    path: '/password-reset',
    name: 'password-reset',
    component: PasswordReset,
  },
  { path: '/MesVehicules', component: MesVehicules },
  { path: '/detailsVehicule/:id', component: detailsVehicule },
  { path: '/side_barre', component: side_barre },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp(App);
app.use(router);
app.mount('#app');

