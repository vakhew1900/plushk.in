import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  runner: {
    binaries: {
      chrome: 'C:\\Users\\T0mmy\\AppData\\Local\\Yandex\\YandexBrowser\\Application\\browser.exe',
    },
  },
});
