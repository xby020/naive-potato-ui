import { App, ComponentOptions } from 'vue';

export default (comp: ComponentOptions) => {
  const name = comp.name || comp.__name || comp.displayName;

  return {
    ...comp,
    install(app: App) {
      app.component(name, comp);
    },
  };
};
