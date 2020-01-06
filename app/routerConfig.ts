import { Application } from 'egg';

const setConfigFn = (app: Application) => {
  const { controller } = app;

  /**
   * 默认值
   * {
   *  cb: 属性值,
   *  method: 'get',
   *  rule: {}, // 使用的插件egg-validate
   * }
   */

  return {
    '/': controller.home.index,
    // 组件管理
    '/component/list': controller.component.getList,
    '/component/create': {
      cb: controller.component.create,
      method: 'post',
      rule: {
        nameCh: 'string',
        nameEn: 'string',
        img: 'string',
      },
    },
  };
};

export interface ConfigValue {
  cb: any;
  method: 'post' | 'get';
  rule: any;
}

export function getConfig(app: Application) {
  const config = setConfigFn(app);
  const routerConfig = {};

  Object.keys(config).forEach(key => {
    const value: ConfigValue | any = config[key];

    if (typeof value === 'function') {
      routerConfig[key] = {
        cb: value,
        method: 'get',
        rule: {},
      };
    } else {
      routerConfig[key] = value;
    }
  });

  return routerConfig;
};
