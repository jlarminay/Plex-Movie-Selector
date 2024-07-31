import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Quasar } from 'quasar';
import App from './App.vue';

import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css';
import 'quasar/src/css/index.sass';
import './assets/style.css';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(Quasar, { plugins: {} });
app.mount('#app');
