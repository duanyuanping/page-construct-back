import { Application } from 'egg';
import { getConfig, ConfigValue } from './routerConfig';

export default (app: Application) => {
  const { router } = app;
  const config = getConfig(app);

  Object.keys(config).forEach(key => {
    const value: ConfigValue = config[key];
    console.log(value.cb)
    router[value.method](key, value.cb);
  })
};
