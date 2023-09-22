import { ComponentOptions, App } from 'vue';
import NaiveCurdTableVue from './NaiveCurdTable.vue';
import withInstall from './utils/withInstall';

// Components
const modules = import.meta.glob<ComponentOptions>(
  './components/**/*.comp.ts',
  { eager: true },
);
const components = Object.keys(modules).map((path) => modules[path]);

const compList = [NaiveCurdTableVue, ...components];

const installList = compList.map((comp) => {
  return withInstall(comp);
});

export default {
  install(app: App) {
    installList.forEach((comp) => {
      app.use(comp);
    });
  },
  ...installList,
};
