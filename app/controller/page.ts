import { Controller } from 'egg';

export default class extends Controller {
  public async getList() {
    const { ctx } = this;
    const { current = '1', pageSize = '10' } = ctx.request.query;

    const result = await ctx.service.page.getList({ current, pageSize });

    ctx.body = result;
  }

  public async create() {
    const { ctx } = this;
    const { name } = ctx.request.query;

    const result = await ctx.service.page.create(name);

    ctx.body = result;
  }

  public async delete() {
    const { ctx } = this;
    const { id } = ctx.request.query;

    const result = await ctx.service.page.delete(id);

    ctx.body = result;
  }

  public async construct() {
    const { ctx } = this;
    const { components, uid, env } = ctx.request.body;

    const result = await ctx.service.page.construct(env, uid, components);

    ctx.body = result;
  }

  public async getCode() {
    const { ctx } = this;
    const { uid } = ctx.request.query;

    const result = await ctx.service.page.getCode(uid);

    ctx.body = result;
  }

  public async preview() {
    const { ctx } = this;
    const { uid } = ctx.request.query;

    const result = await ctx.service.page.transferPage('preview', uid);

    ctx.body = result;
  }

  public async online() {
    const { ctx } = this;
    const { uid, onlineTime, offlineTime } = ctx.request.query;

    const result = await ctx.service.page.online({
      uid,
      onlineTime: onlineTime ? new Date(Number(onlineTime)) : null,
      offlineTime: offlineTime ? new Date(Number(offlineTime)) : null,
    });

    ctx.body = result;
  }

  public async check() {
    const { ctx } = this;
    const { uid } = ctx.request.query;

    const result = await ctx.service.page.check(uid);

    if (result) {
      ctx.redirect(result);
    }
  }

  public async detail() {
    const { ctx } = this;
    const { uid } = ctx.request.query;

    const result = await ctx.service.page.getDetail(uid);

    ctx.body = result;
  }

  public async update() {
    const { ctx } = this;
    const { id, name, onlineTime, offlineTime } = ctx.request.body;

    const result = await ctx.service.page.update(id, {
      name,
      onlineTime: onlineTime ? new Date(Number(onlineTime)) : null,
      offlineTime: offlineTime ? new Date(Number(offlineTime)) : null,
    });

    ctx.body = result;
  }
}
