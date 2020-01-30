import { Controller } from 'egg';

export default class ComponentController extends Controller {
  public async getList() {
    const { ctx } = this;

    const result = await ctx.service.component.getList();

    ctx.body = {
        code : 0,
        data: result,
        msg: 'success',
    };
  }

  public async create() {
    const { ctx } = this;
    const options = ctx.request.body;

    const result = await ctx.service.component.create(options);
    if (result.affectedRows) {
      ctx.body = {
        code: 0,
        msg: 'success',
      };
    } else {
      ctx.body = {
        code: 1,
        msg: '数据库操作失败',
      };
    }

  }
}
