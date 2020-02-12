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
    '/component/editor': {
      cb: controller.component.editor,
      method: 'post',
      rule: {
        nameCh: 'string',
        nameEn: 'string',
        image: 'string',
      },
    },
    '/page/list': controller.page.getList,
    '/page/create': {
      cb: controller.page.create,
      method: 'get',
      rule: {
        name: 'string',
      },
    },
    '/page/delete': {
      cb: controller.page.delete,
      method: 'get',
      rule: {
        id: 'string',
      },
    },
    '/page/construct': {
      cb: controller.page.construct,
      method: 'post',
      rule: {
        uid: 'string',
        components: 'array',
      },
    },
    '/page/code': {
      cb: controller.page.getCode,
      method: 'get',
      rule: {
        uid: 'string',
      },
    },
    '/page/preview': {
      cb: controller.page.preview,
      method: 'get',
      rule: {
        uid: 'string',
      },
    },
    '/page/online': {
      cb: controller.page.online,
      method: 'get',
      rule: {
        uid: 'string',
      },
    },
    '/page/check': {
      cb: controller.page.check,
      method: 'get',
      rule: {
        uid: 'string',
      },
    },
    '/page/detail': {
      cb: controller.page.detail,
      method: 'get',
      rule: {
        uid: 'string',
      },
    },
    '/page/update': {
      cb: controller.page.update,
      method: 'post',
      rule: {
        id: 'number',
        name: 'string',
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
}
