import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {
    mysql: {
      client: {
        // host
        host: '127.0.0.1',
        // 端口号
        port: '3306',
        // 用户名
        user: 'root',
        // 密码
        password: 'passWord111.',
        // 数据库名
        database: 'construct',
      },
      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,
    },
  };
  return config;
};
