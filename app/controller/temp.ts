import { Controller } from 'egg';

export default class extends Controller {
  public async update() {
    const { ctx } = this;

    const result = await this.service.temp.update();

    if (result.code === 0) {
      ctx.body = result;
    } else {
      ctx.status = 500;
    }
  }
}
