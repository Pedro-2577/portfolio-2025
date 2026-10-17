import { createApp } from 'vue';
import App from './App.vue';
import { appFailure } from './appFailure';
import './style.css';
import './portfolioMotion.css';
import './httpErrors.css';

const app = createApp(App);
app.config.errorHandler = (error) => {
  console.error('Portfolio application error:', error);
  appFailure.value = true;
};
app.mount('#app');
