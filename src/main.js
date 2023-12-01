import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
// import teamplCore from './assets/js/teamplCore';

const app = createApp(App);
app.use(router);
// app.use(teamplCore);

app.mount('#app');
