import { Controller } from 'egg';

export default class extends Controller {
  public async create() {
    const { ctx } = this;
    const { name } = ctx.request.query;

    const result = await ctx.service.page.create(name);

    ctx.body = result;
  }

  public async construct() {
    const { ctx } = this;
    const { components, page } = ctx.request.body;

    const result = await ctx.service.page.construct(page, components);

    ctx.body = result;
  }
}
