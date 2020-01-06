import { Context } from 'egg';
import { getConfig, ConfigValue } from '../routerConfig';

export default function validate(): any {
    return async (ctx: Context, next: () => Promise<any>) => {
      const { path, request, app } = ctx;
      const config = getConfig(app);
      const value: ConfigValue = config[path];
      const rule = value.rule || {};
      const options = value.method === 'post' ? request.body : request.query;
      const err = ctx.app.validator.validate(rule, options);

      if (err) {
        return ctx.body = {
          code: 1,
          msg: '参数错误',
        };
      }

      await next();
    };
}
