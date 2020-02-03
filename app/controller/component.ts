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

  public async editor() {
    const { ctx } = this;
    const { id, nameCh, nameEn, image, description, props } = ctx.request.body;

    const result = await ctx.service.component.editor({ nameCh, nameEn, image, description }, props, id);
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
